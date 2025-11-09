-- Sample seed data for testing and demo

-- Insert sample vendors
INSERT INTO vendors (company_name, ein, address, contact_email, contact_phone, status, onboarding_progress, created_at) VALUES
('TechVendor Inc', '12-3456789', '123 Silicon Valley, CA 94025', 'contact@techvendor.com', '+1-650-555-0100', 'under_review', 65, NOW() - INTERVAL '5 days'),
('Global Supply Co', '98-7654321', '456 Trade Street, NY 10001', 'info@globalsupply.com', '+1-212-555-0200', 'submitted', 25, NOW() - INTERVAL '2 days'),
('SecureIT Solutions', '45-6789012', '789 Cyber Drive, TX 75001', 'hello@secureit.com', '+1-214-555-0300', 'risk_assessment', 80, NOW() - INTERVAL '10 days'),
('EcoFriendly Products', '23-4567890', '321 Green Lane, OR 97001', 'contact@ecofriendly.com', '+1-503-555-0400', 'approved', 100, NOW() - INTERVAL '30 days'),
('QuickShip Logistics', '67-8901234', '555 Delivery Road, IL 60601', 'support@quickship.com', '+1-312-555-0500', 'rejected', 45, NOW() - INTERVAL '15 days');

-- Insert sample documents
INSERT INTO documents (vendor_id, document_type, s3_bucket, s3_key, status, file_size_bytes, mime_type, uploaded_at)
SELECT
    id,
    'w9',
    'onboarding-hub-documents',
    'vendors/' || id || '/w9_form.pdf',
    'verified',
    245678,
    'application/pdf',
    created_at + INTERVAL '1 hour'
FROM vendors
WHERE company_name = 'TechVendor Inc';

INSERT INTO documents (vendor_id, document_type, s3_bucket, s3_key, status, file_size_bytes, mime_type, uploaded_at)
SELECT
    id,
    'insurance',
    'onboarding-hub-documents',
    'vendors/' || id || '/insurance_cert.pdf',
    'verified',
    189234,
    'application/pdf',
    created_at + INTERVAL '2 hours'
FROM vendors
WHERE company_name = 'TechVendor Inc';

-- Insert sample risk scores
INSERT INTO risk_scores (vendor_id, overall_score, financial_score, compliance_score, cyber_score, esg_score, risk_level, sanctions_result, red_flags)
SELECT
    id,
    42,  -- Overall score
    30,  -- Financial (good)
    45,  -- Compliance (medium)
    60,  -- Cyber (needs improvement)
    25,  -- ESG (good)
    'medium',
    '{"matches": 0, "response_time_ms": 347, "lists_checked": ["OFAC", "EU", "UN"]}'::jsonb,
    ARRAY['Missing SOC 2 certification', 'Outdated cyber insurance']
FROM vendors
WHERE company_name = 'TechVendor Inc';

INSERT INTO risk_scores (vendor_id, overall_score, financial_score, compliance_score, cyber_score, esg_score, risk_level, sanctions_result, red_flags)
SELECT
    id,
    18,  -- Overall score (low risk)
    15,
    20,
    25,
    12,
    'low',
    '{"matches": 0, "response_time_ms": 298, "lists_checked": ["OFAC", "EU", "UN"]}'::jsonb,
    ARRAY[]::TEXT[]
FROM vendors
WHERE company_name = 'EcoFriendly Products';

INSERT INTO risk_scores (vendor_id, overall_score, financial_score, compliance_score, cyber_score, esg_score, risk_level, sanctions_result, red_flags)
SELECT
    id,
    85,  -- Overall score (high risk)
    70,
    90,
    95,
    80,
    'high',
    '{"matches": 1, "response_time_ms": 412, "lists_checked": ["OFAC", "EU", "UN"], "match_details": "Subsidiary flagged"}'::jsonb,
    ARRAY['Sanctions screening match on subsidiary', 'Missing financial statements', 'No BCP documentation', 'High debt-to-equity ratio']
FROM vendors
WHERE company_name = 'QuickShip Logistics';

-- Insert sample ESG questionnaires
INSERT INTO esg_questionnaires (vendor_id, questions, auto_filled, total_questions, answered_questions, completion_percentage)
SELECT
    id,
    '[
        {"question": "Do you have an environmental management system?", "answer": "Yes", "confidence": 0.95, "source": "ISO 14001 certificate"},
        {"question": "Do you track carbon emissions?", "answer": "Yes", "confidence": 0.88, "source": "Sustainability report"},
        {"question": "Do you have a diversity and inclusion policy?", "answer": "Yes", "confidence": 0.92, "source": "Company handbook"}
    ]'::jsonb,
    true,
    15,
    13,
    86.67
FROM vendors
WHERE company_name = 'TechVendor Inc';

-- Insert sample audit logs
INSERT INTO audit_logs (vendor_id, action, actor, metadata, success, timestamp)
SELECT
    id,
    'vendor_created',
    'system',
    '{"source": "api", "ip_address": "192.168.1.100"}'::jsonb,
    true,
    created_at
FROM vendors;

INSERT INTO audit_logs (vendor_id, action, actor, metadata, success, timestamp)
SELECT
    v.id,
    'document_uploaded',
    'contact@techvendor.com',
    ('{"document_type": "' || d.document_type || '", "file_size": ' || d.file_size_bytes || '}')::jsonb,
    true,
    d.uploaded_at
FROM vendors v
JOIN documents d ON v.id = d.vendor_id
WHERE v.company_name = 'TechVendor Inc';

INSERT INTO audit_logs (vendor_id, action, actor, metadata, success, timestamp)
SELECT
    v.id,
    'risk_assessment_completed',
    'system',
    ('{"overall_score": ' || rs.overall_score || ', "risk_level": "' || rs.risk_level || '"}')::jsonb,
    true,
    rs.calculated_at
FROM vendors v
JOIN risk_scores rs ON v.id = rs.vendor_id
WHERE v.company_name = 'TechVendor Inc';

-- Insert sample approval workflows
INSERT INTO approval_workflows (vendor_id, current_step, status, required_approvers, completed_approvals)
SELECT
    id,
    'final_approval',
    'pending',
    ARRAY['compliance@gs.com', 'procurement@gs.com']::TEXT[],
    '{}'::jsonb
FROM vendors
WHERE company_name = 'TechVendor Inc';
