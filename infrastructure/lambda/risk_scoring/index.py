"""
Lambda Function: Risk Scoring
Calculates vendor risk scores based on multiple factors
"""
import json
import psycopg2
import os
import boto3
import requests
from datetime import datetime

secrets_client = boto3.client('secretsmanager')

def get_db_connection():
    secret_arn = os.environ['DB_SECRET_ARN']
    response = secrets_client.get_secret_value(SecretId=secret_arn)
    secret = json.loads(response['SecretString'])

    return psycopg2.connect(
        host=os.environ['DB_HOST'],
        port=os.environ['DB_PORT'],
        database=os.environ['DB_NAME'],
        user=secret['username'],
        password=secret['password']
    )

def perform_sanctions_screening(company_name, ein):
    """
    Perform sanctions screening via API
    For demo: returns mock data
    In production: integrate with Sanctions.io API
    """
    # Mock sanctions screening for demo
    return {
        "matches": 0,
        "response_time_ms": 347,
        "lists_checked": ["OFAC", "EU", "UN"],
        "screened_at": datetime.utcnow().isoformat()
    }

def calculate_financial_score(vendor_data):
    """Calculate financial risk score (0-100, lower is better)"""
    # Simplified scoring for demo
    # In production: analyze financial statements, credit reports
    base_score = 30

    # Check if EIN is provided
    if not vendor_data.get('ein'):
        base_score += 20

    return min(base_score, 100)

def calculate_compliance_score(documents):
    """Calculate compliance risk score"""
    base_score = 20

    # Check for required documents
    doc_types = {d['document_type'] for d in documents}

    if 'w9' not in doc_types:
        base_score += 25
    if 'insurance' not in doc_types:
        base_score += 20
    if 'diversity_cert' not in doc_types:
        base_score += 10

    return min(base_score, 100)

def calculate_cyber_score(documents):
    """Calculate cybersecurity risk score"""
    base_score = 25

    doc_types = {d['document_type'] for d in documents}

    if 'soc2' not in doc_types:
        base_score += 40
    if 'iso_cert' not in doc_types:
        base_score += 20

    return min(base_score, 100)

def calculate_esg_score(esg_data):
    """Calculate ESG risk score"""
    if not esg_data:
        return 50  # Medium risk if no ESG data

    # Base score on completion percentage
    completion = esg_data.get('completion_percentage', 0)
    return int((100 - completion) / 2)  # Inverse of completion

def handler(event, context):
    """
    Calculate risk scores for a vendor

    Response: {
        "overall_score": 42,
        "breakdown": {
            "financial": 30,
            "compliance": 45,
            "cyber": 60,
            "esg": 25
        },
        "risk_level": "medium",
        "sanctions_screening": {...},
        "red_flags": [...]
    }
    """
    try:
        # Get vendor ID from path or event
        vendor_id = event.get('pathParameters', {}).get('id')
        if not vendor_id:
            body = json.loads(event.get('body', '{}'))
            vendor_id = body.get('vendor_id')

        if not vendor_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing vendor ID'})
            }

        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get vendor data
        cursor.execute("""
            SELECT company_name, ein, contact_email
            FROM vendors
            WHERE id = %s
        """, (vendor_id,))
        vendor = cursor.fetchone()

        if not vendor:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Vendor not found'})
            }

        company_name, ein, email = vendor
        vendor_data = {'company_name': company_name, 'ein': ein, 'email': email}

        # Get documents
        cursor.execute("""
            SELECT document_type, status, extracted_data
            FROM documents
            WHERE vendor_id = %s
        """, (vendor_id,))
        documents = [
            {'document_type': row[0], 'status': row[1], 'extracted_data': row[2]}
            for row in cursor.fetchall()
        ]

        # Get ESG data
        cursor.execute("""
            SELECT completion_percentage, questions
            FROM esg_questionnaires
            WHERE vendor_id = %s
            ORDER BY completed_at DESC
            LIMIT 1
        """, (vendor_id,))
        esg_row = cursor.fetchone()
        esg_data = {
            'completion_percentage': esg_row[0] if esg_row else 0,
            'questions': esg_row[1] if esg_row else {}
        }

        # Perform sanctions screening
        sanctions_result = perform_sanctions_screening(company_name, ein)

        # Calculate component scores
        financial_score = calculate_financial_score(vendor_data)
        compliance_score = calculate_compliance_score(documents)
        cyber_score = calculate_cyber_score(documents)
        esg_score = calculate_esg_score(esg_data)

        # Calculate overall score (weighted average)
        overall_score = int(
            financial_score * 0.25 +
            compliance_score * 0.35 +
            cyber_score * 0.25 +
            esg_score * 0.15
        )

        # Determine risk level
        if overall_score < 30:
            risk_level = 'low'
        elif overall_score < 60:
            risk_level = 'medium'
        elif overall_score < 80:
            risk_level = 'high'
        else:
            risk_level = 'critical'

        # Identify red flags
        red_flags = []
        if sanctions_result['matches'] > 0:
            red_flags.append('Sanctions screening match found')
        if not ein:
            red_flags.append('Missing EIN')
        if cyber_score > 60:
            red_flags.append('Missing cybersecurity certifications (SOC 2, ISO 27001)')
        if compliance_score > 50:
            red_flags.append('Missing compliance documentation')

        # Save risk score to database
        cursor.execute("""
            INSERT INTO risk_scores (
                vendor_id, overall_score, financial_score, compliance_score,
                cyber_score, esg_score, sanctions_result, red_flags, risk_level
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, calculated_at
        """, (
            vendor_id, overall_score, financial_score, compliance_score,
            cyber_score, esg_score, json.dumps(sanctions_result),
            red_flags, risk_level
        ))

        risk_id, calculated_at = cursor.fetchone()

        # Log audit event
        cursor.execute("""
            INSERT INTO audit_logs (vendor_id, action, actor, metadata)
            VALUES (%s, %s, %s, %s)
        """, (
            vendor_id,
            'risk_assessment_completed',
            'system',
            json.dumps({
                "overall_score": overall_score,
                "risk_level": risk_level
            })
        ))

        conn.commit()
        cursor.close()
        conn.close()

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'vendor_id': vendor_id,
                'overall_score': overall_score,
                'breakdown': {
                    'financial': financial_score,
                    'compliance': compliance_score,
                    'cyber': cyber_score,
                    'esg': esg_score
                },
                'risk_level': risk_level,
                'sanctions_screening': sanctions_result,
                'red_flags': red_flags,
                'calculated_at': calculated_at.isoformat()
            })
        }

    except Exception as e:
        print(f"Error calculating risk score: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Failed to calculate risk score',
                'message': str(e)
            })
        }
