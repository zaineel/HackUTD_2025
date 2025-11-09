# Architecture Documentation

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Person 2)                          │
│                    React + TypeScript + Tailwind                     │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API GATEWAY (REST)                             │
│                    - CORS enabled                                    │
│                    - Throttling: 100 req/sec                         │
│                    - Stage: prod                                     │
└─────┬──────────┬──────────┬──────────┬──────────┬────────────────────┘
      │          │          │          │          │
      ▼          ▼          ▼          ▼          ▼
┌─────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Upload  │ │Create  │ │ Status │ │  Risk  │ │Approve │
│ Handler │ │Vendor  │ │Handler │ │ Scorer │ │Handler │
│ Lambda  │ │Lambda  │ │ Lambda │ │ Lambda │ │ Lambda │
└────┬────┘ └───┬────┘ └───┬────┘ └───┬────┘ └───┬────┘
     │          │           │          │          │
     │          └───────────┴──────────┴──────────┘
     │                      │
     ▼                      ▼
┌─────────────┐    ┌──────────────────────────────┐
│  S3 Bucket  │    │   RDS Aurora PostgreSQL      │
│  (Encrypted)│    │   (Serverless v2)            │
│             │    │   - vendors table            │
│  + KMS Key  │    │   - documents table          │
│  (Customer  │    │   - risk_scores table        │
│   Managed)  │    │   - esg_questionnaires       │
└─────────────┘    │   - audit_logs table         │
                   └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    VPC (10.0.0.0/16)                                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Public Subnet (10.0.0.0/24, 10.0.1.0/24)                    │    │
│  │ - Internet Gateway                                           │    │
│  │ - NAT Gateway                                                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Private Subnet (10.0.2.0/24, 10.0.3.0/24)                   │    │
│  │ - Lambda Functions                                           │    │
│  │ - Outbound internet via NAT                                  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Isolated Subnet (10.0.4.0/24, 10.0.5.0/24)                  │    │
│  │ - RDS Database                                               │    │
│  │ - NO internet access                                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    SECURITY & MONITORING                             │
│  - CloudWatch Logs (all Lambda functions)                           │
│  - CloudTrail (audit logging)                                       │
│  - KMS Customer-Managed Keys                                        │
│  - VPC Security Groups                                              │
│  - IAM Roles (least privilege)                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow: Document Upload → Risk Assessment

```
1. Frontend (Person 2)
   │
   │ POST /documents/upload
   ▼
2. Upload Handler Lambda
   │ - Generates presigned S3 URL
   │ - Returns URL to frontend
   ▼
3. Frontend uploads directly to S3
   │ - Uses presigned URL
   │ - Bypasses API Gateway
   ▼
4. S3 Bucket (encrypted with KMS)
   │ - Document stored
   │ - S3 event trigger fires
   ▼
5. Process Document Lambda (Person 3's code)
   │ - Calls AWS Textract
   │ - Extracts data (EIN, company name, etc.)
   │ - Stores in database
   ▼
6. Database (RDS Aurora)
   │ - document record updated
   │ - status: "extracted"
   ▼
7. Risk Scoring Lambda (triggered by API call)
   │ - Reads document data
   │ - Calls Sanctions API
   │ - Calculates risk score
   │ - Stores in risk_scores table
   ▼
8. Frontend polls GET /vendors/{id}/status
   │ - Shows progress: 65%
   │ - Shows risk score: 42/100
   ▼
9. Admin approves via POST /vendors/{id}/approve
   │ - Updates vendor status to "approved"
   │ - Sends email notification (SES)
   ▼
10. Audit log created
    - Action: "vendor_approved"
    - Actor: "reviewer@gs.com"
    - Timestamp: UTC
```

---

## 🔐 Security Architecture

### 1. Network Security (VPC)
- **3-tier subnet design**: Public, Private, Isolated
- **Security Groups**: Least-privilege access
  - Lambda → RDS: Port 5432 only
  - RDS: No inbound from internet
- **No public database access**: RDS in isolated subnet

### 2. Data Encryption
- **At Rest**:
  - S3: Customer-managed KMS key
  - RDS: AWS-managed encryption
  - EBS volumes: Encrypted
- **In Transit**:
  - API Gateway: TLS 1.2+ enforced
  - S3 presigned URLs: HTTPS only
  - Lambda → RDS: SSL connection

### 3. Identity & Access Management
- **Lambda Execution Roles**: Separate role per function
- **Least Privilege**: Only necessary permissions
- **No hardcoded credentials**: Secrets Manager for DB password

### 4. Audit & Compliance
- **CloudTrail**: All API calls logged
- **Database Audit Logs**: All vendor actions tracked
- **CloudWatch Logs**: Lambda execution logs retained
- **Immutable Records**: Audit logs cannot be modified

---

## 📈 Scalability Design

### Auto-Scaling Components
1. **Lambda Functions**: Auto-scale to 1000 concurrent executions
2. **Aurora Serverless**: Scales from 0.5 to 2 ACUs automatically
3. **API Gateway**: Handles millions of requests

### Performance Characteristics
- **API Latency**: ~50-200ms (Lambda cold start: ~1-2s)
- **Database**: Serverless v2 scales in <1 second
- **S3 Upload**: Direct upload (no API Gateway bottleneck)

### Cost Optimization
- **Aurora Serverless**: Pay per second of usage
- **Lambda**: Pay per invocation + duration
- **S3 Lifecycle**: Move to IA after 90 days
- **NAT Gateway**: Single NAT for cost savings (hackathon only)

---

## 🎯 API Endpoint Details

### POST /vendors
**Purpose**: Create new vendor
**Lambda**: create_vendor_handler
**Database**: INSERT into vendors table
**Response Time**: ~200ms

### GET /vendors/{id}/status
**Purpose**: Get onboarding progress
**Lambda**: status_handler
**Database**: JOIN vendors + documents + esg_questionnaires
**Response Time**: ~150ms

### POST /vendors/{id}/risk-score
**Purpose**: Calculate risk assessment
**Lambda**: risk_score_handler
**External APIs**: Sanctions.io (347ms avg)
**Database**: INSERT into risk_scores table
**Response Time**: ~500ms (includes sanctions API)

### POST /vendors/{id}/approve
**Purpose**: Approve/reject vendor
**Lambda**: approve_handler
**Database**: UPDATE vendors, INSERT into approval_workflows, audit_logs
**Side Effects**: Email notification via SES
**Response Time**: ~300ms

### POST /documents/upload
**Purpose**: Get presigned upload URL
**Lambda**: upload_handler
**S3**: Generate presigned POST
**Response Time**: ~50ms

---

## 🧩 Component Responsibilities

### Person 1 (You): Infrastructure
- ✅ VPC, subnets, security groups
- ✅ S3 bucket with KMS encryption
- ✅ RDS Aurora database
- ✅ Lambda functions (5)
- ✅ API Gateway REST API
- ✅ IAM roles and policies

### Person 2: Frontend
- React components
- API integration (calls your endpoints)
- Document upload UI
- Dashboard visualizations

### Person 3: AI/ML
- Textract integration (add to risk_scoring Lambda)
- Comprehend entity extraction
- Sanctions API integration
- Step Functions workflow

### Person 4: Backend/Integration
- FastAPI application (optional layer)
- Database queries
- Mock integrations (KY3P, SLP, Ariba)
- Demo video and slides

---

## 🚀 Deployment Architecture

### CDK Stacks (Deployment Order)
1. **VpcStack**: Foundation (2-3 min)
2. **StorageStack**: S3 + KMS (1-2 min)
3. **DatabaseStack**: RDS (5-8 min) ⏱️
4. **LambdaStack**: Functions (3-4 min)
5. **ApiStack**: API Gateway (1-2 min)

**Total**: ~15-20 minutes

### Dependencies
```
VpcStack
  ├── StorageStack
  ├── DatabaseStack
  │     ├── LambdaStack
  │     │     └── ApiStack
```

---

## 💰 Cost Estimate (Hackathon - 24 hours)

| Service | Usage | Cost |
|---------|-------|------|
| Lambda | 10,000 invocations, 512MB | $0.10 |
| Aurora Serverless | 24 hours, 0.5 ACU avg | $3.50 |
| S3 | 100 documents, 1GB | $0.05 |
| API Gateway | 10,000 requests | $0.04 |
| NAT Gateway | 24 hours | $1.08 |
| CloudWatch Logs | 1GB | $0.50 |
| **TOTAL** | | **~$5.27** |

*Assumes light testing load. Demo costs are minimal.*

---

## 🔗 Integration Points

### Frontend → Backend
- **API Base URL**: Provided via CloudFormation output
- **Authentication**: None (hackathon MVP)
- **CORS**: Enabled for all origins

### Lambda → Database
- **Connection**: VPC-based (Lambda in private subnet)
- **Credentials**: Secrets Manager
- **Library**: psycopg2-binary

### Lambda → S3
- **Access**: IAM role-based
- **Encryption**: KMS key access granted
- **Trigger**: S3 event notifications (for document processing)

### Lambda → AWS AI Services
- **Textract**: IAM policy grants AnalyzeDocument
- **Comprehend**: IAM policy grants DetectEntities
- **Integration**: Add code to risk_scoring Lambda

---

## 📊 Database Schema Summary

### vendors
- Core vendor information
- Status tracking
- Integration IDs (KY3P, SLP, Ariba)

### documents
- Document metadata
- S3 references
- Textract extraction results (JSONB)

### risk_scores
- Component scores (financial, compliance, cyber, ESG)
- Sanctions screening results
- Red flags array

### esg_questionnaires
- Auto-filled questions (JSONB)
- Confidence scores
- Source attribution

### audit_logs
- Immutable audit trail
- All vendor actions
- System and user events

---

## 🎬 Demo Talking Points

### Security
1. **Show KMS Key**: AWS Console → KMS → Show customer-managed key
2. **Show VPC Diagram**: VPC console → Show 3-tier subnet design
3. **Show CloudTrail**: CloudTrail console → Recent events

### Scalability
1. **Lambda Concurrency**: Explain auto-scaling to 1000
2. **Aurora Serverless**: Show ACU scaling configuration
3. **API Gateway Throttling**: Show rate limit settings

### Cost Efficiency
1. **Serverless**: Pay per use, not per hour
2. **Aurora Serverless v2**: Scales to zero when idle
3. **S3 Lifecycle**: Automatic archival to IA storage

---

## ⚠️ Known Limitations (MVP)

1. **No Authentication**: Public API (add Cognito for production)
2. **Single Region**: No multi-region failover
3. **Basic Error Handling**: Production needs retry logic
4. **No Rate Limiting**: Beyond API Gateway throttling
5. **Hardcoded Values**: Some configs should be parameters

---

## 🔮 Future Enhancements

1. **AWS Cognito**: User authentication and authorization
2. **Step Functions**: Orchestrate multi-step workflows
3. **SQS**: Decouple Lambda invocations
4. **ElastiCache**: Cache frequent database queries
5. **Multi-AZ**: Full high availability
6. **AWS WAF**: Web application firewall for API Gateway
7. **Secrets Rotation**: Auto-rotate database passwords
8. **CloudFront**: CDN for frontend hosting

---

This architecture demonstrates Goldman Sachs' requirements:
✅ Customer-managed encryption (KMS)
✅ VPC isolation and network security
✅ Audit logging and compliance
✅ Scalable serverless design
✅ AI/ML integration points
