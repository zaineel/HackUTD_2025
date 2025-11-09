"""
Lambda Function: Approve/Reject Vendor
Handles vendor approval workflow
"""
import json
import psycopg2
import os
import boto3
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

def handler(event, context):
    """
    Approve or reject a vendor

    Request: {
        "approved": true,
        "comments": "All checks passed",
        "approver_email": "reviewer@gs.com"
    }

    Response: {
        "status": "approved",
        "approved_at": "2025-11-08T10:30:00Z"
    }
    """
    try:
        # Get vendor ID and approval data
        vendor_id = event.get('pathParameters', {}).get('id')
        body = json.loads(event.get('body', '{}'))

        approved = body.get('approved', False)
        comments = body.get('comments', '')
        approver_email = body.get('approver_email', 'system')

        if not vendor_id:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Missing vendor ID'})
            }

        # Connect to database
        conn = get_db_connection()
        cursor = conn.cursor()

        # Update vendor status
        new_status = 'approved' if approved else 'rejected'
        cursor.execute("""
            UPDATE vendors
            SET status = %s, onboarding_progress = %s, updated_at = %s
            WHERE id = %s
            RETURNING company_name, contact_email
        """, (new_status, 100 if approved else 0, datetime.utcnow(), vendor_id))

        result = cursor.fetchone()
        if not result:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'error': 'Vendor not found'})
            }

        company_name, contact_email = result

        # Create approval workflow record
        cursor.execute("""
            INSERT INTO approval_workflows (
                vendor_id, current_step, status, final_decision,
                decision_comments, decision_by, decision_at
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            vendor_id,
            'final_approval',
            new_status,
            approved,
            comments,
            approver_email,
            datetime.utcnow()
        ))

        # Log audit event
        cursor.execute("""
            INSERT INTO audit_logs (vendor_id, action, actor, metadata)
            VALUES (%s, %s, %s, %s)
        """, (
            vendor_id,
            f'vendor_{new_status}',
            approver_email,
            json.dumps({
                "comments": comments,
                "company_name": company_name
            })
        ))

        conn.commit()
        cursor.close()
        conn.close()

        # In production: send email notification to vendor
        # ses_client = boto3.client('ses')
        # ses_client.send_email(...)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'vendor_id': vendor_id,
                'status': new_status,
                'approved': approved,
                'approved_at': datetime.utcnow().isoformat(),
                'message': f'Vendor {company_name} has been {new_status}'
            })
        }

    except Exception as e:
        print(f"Error approving vendor: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({
                'error': 'Failed to process approval',
                'message': str(e)
            })
        }
