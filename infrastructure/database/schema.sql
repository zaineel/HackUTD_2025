-- Goldman Sachs Vendor Onboarding Hub - Database Schema
-- PostgreSQL Schema for vendor management system

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================
-- VENDORS TABLE
-- ====================
CREATE TABLE vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    ein VARCHAR(20),  -- Employer Identification Number
    address TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN (
        'submitted',
        'documents_pending',
        'under_review',
        'risk_assessment',
        'approved',
        'rejected',
        'onboarding_complete'
    )),
    onboarding_progress INT DEFAULT 0 CHECK (onboarding_progress >= 0 AND onboarding_progress <= 100),

    -- Integration IDs with external systems
    ky3p_assessment_id VARCHAR(100),  -- IHS Markit KY3P assessment ID
    slp_supplier_id VARCHAR(100),     -- Ariba SLP supplier ID
    ariba_account_number VARCHAR(100), -- Ariba Network account number

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster status queries
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_created_at ON vendors(created_at);
CREATE INDEX idx_vendors_email ON vendors(contact_email);

-- ====================
-- DOCUMENTS TABLE
-- ====================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'w9',                 -- W-9 tax form
        'insurance',          -- Insurance certificate
        'diversity_cert',     -- Diversity certification
        'bcp',               -- Business Continuity Plan
        'soc2',              -- SOC 2 report
        'iso_cert',          -- ISO certifications
        'financial_stmt',     -- Financial statements
        'other'
    )),
    s3_bucket VARCHAR(255) NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    status VARCHAR(50) DEFAULT 'uploaded' CHECK (status IN (
        'uploaded',
        'processing',
        'extracted',
        'verified',
        'failed'
    )),
    extracted_data JSONB,  -- Textract extraction results
    file_size_bytes BIGINT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Indexes for faster queries
CREATE INDEX idx_documents_vendor ON documents(vendor_id);
CREATE INDEX idx_documents_type ON documents(document_type);
CREATE INDEX idx_documents_status ON documents(status);

-- ====================
-- RISK_SCORES TABLE
-- ====================
CREATE TABLE risk_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,

    -- Overall risk score (0-100, lower is better)
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),

    -- Component scores
    financial_score INT CHECK (financial_score >= 0 AND financial_score <= 100),
    compliance_score INT CHECK (compliance_score >= 0 AND compliance_score <= 100),
    cyber_score INT CHECK (cyber_score >= 0 AND cyber_score <= 100),
    esg_score INT CHECK (esg_score >= 0 AND esg_score <= 100),

    -- Sanctions screening result
    sanctions_result JSONB,  -- { "matches": 0, "response_time_ms": 347, "lists_checked": [...] }

    -- Risk flags
    red_flags TEXT[],  -- Array of risk concerns

    -- Risk level categorization
    risk_level VARCHAR(20) CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),

    -- Timestamps
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP  -- Risk scores should be refreshed periodically
);

-- Indexes
CREATE INDEX idx_risk_scores_vendor ON risk_scores(vendor_id);
CREATE INDEX idx_risk_scores_overall ON risk_scores(overall_score);
CREATE INDEX idx_risk_scores_level ON risk_scores(risk_level);

-- ====================
-- ESG_QUESTIONNAIRES TABLE
-- ====================
CREATE TABLE esg_questionnaires (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,

    -- Questions and answers stored as JSONB
    -- Format: [{ "question": "...", "answer": "...", "confidence": 0.95, "source": "ISO14001 cert" }]
    questions JSONB NOT NULL,

    -- Metadata
    auto_filled BOOLEAN DEFAULT FALSE,  -- Was this auto-filled from documents?
    total_questions INT,
    answered_questions INT,
    completion_percentage DECIMAL(5,2),

    -- Timestamps
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewed_by VARCHAR(255)
);

-- Indexes
CREATE INDEX idx_esg_vendor ON esg_questionnaires(vendor_id);

-- ====================
-- AUDIT_LOGS TABLE
-- ====================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID,  -- NULL for system-wide events

    -- Event details
    action VARCHAR(100) NOT NULL,  -- e.g., 'document_uploaded', 'risk_scored', 'vendor_approved'
    actor VARCHAR(255),  -- Email of user or 'system'
    actor_ip VARCHAR(50),

    -- Additional context
    metadata JSONB,  -- Store additional event-specific data

    -- Result
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,

    -- Timestamp
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for audit queries
CREATE INDEX idx_audit_vendor ON audit_logs(vendor_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_actor ON audit_logs(actor);

-- ====================
-- APPROVAL_WORKFLOWS TABLE
-- ====================
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,

    -- Workflow state
    current_step VARCHAR(100) NOT NULL,  -- e.g., 'document_review', 'risk_assessment', 'final_approval'
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),

    -- Approvers
    required_approvers TEXT[],  -- Array of email addresses
    completed_approvals JSONB,  -- { "email@gs.com": { "approved": true, "timestamp": "...", "comments": "..." } }

    -- Decisions
    final_decision BOOLEAN,
    decision_comments TEXT,
    decision_by VARCHAR(255),
    decision_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_approval_vendor ON approval_workflows(vendor_id);
CREATE INDEX idx_approval_status ON approval_workflows(status);

-- ====================
-- FUNCTIONS & TRIGGERS
-- ====================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for vendors table
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for approval_workflows table
CREATE TRIGGER update_approval_workflows_updated_at BEFORE UPDATE ON approval_workflows
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- VIEWS FOR COMMON QUERIES
-- ====================

-- View: Vendor onboarding dashboard
CREATE VIEW vendor_dashboard AS
SELECT
    v.id,
    v.company_name,
    v.contact_email,
    v.status,
    v.onboarding_progress,
    v.created_at,
    COUNT(DISTINCT d.id) as document_count,
    COUNT(DISTINCT CASE WHEN d.status = 'verified' THEN d.id END) as verified_documents,
    rs.overall_score as risk_score,
    rs.risk_level,
    rs.calculated_at as risk_assessed_at
FROM vendors v
LEFT JOIN documents d ON v.id = d.vendor_id
LEFT JOIN risk_scores rs ON v.id = rs.vendor_id
GROUP BY v.id, rs.overall_score, rs.risk_level, rs.calculated_at;

-- View: High-risk vendors requiring attention
CREATE VIEW high_risk_vendors AS
SELECT
    v.*,
    rs.overall_score,
    rs.red_flags,
    rs.calculated_at
FROM vendors v
INNER JOIN risk_scores rs ON v.id = rs.vendor_id
WHERE rs.risk_level IN ('high', 'critical')
  AND v.status NOT IN ('rejected', 'approved')
ORDER BY rs.overall_score DESC;

-- ====================
-- SAMPLE DATA (for testing)
-- ====================

-- This will be populated separately in seed.sql
