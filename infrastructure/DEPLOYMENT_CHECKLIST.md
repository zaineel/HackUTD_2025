# 🚀 Deployment Checklist - Person 1 (Infrastructure Lead)

## ✅ Pre-Deployment (Do This BEFORE Hackathon)

### AWS Setup
- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] IAM user with AdministratorAccess created
- [ ] AWS credentials configured: `aws configure`
- [ ] Test AWS access: `aws sts get-caller-identity`
- [ ] Note your Account ID: `aws sts get-caller-identity --query Account --output text`

### Development Environment
- [ ] Node.js installed (for AWS CDK)
- [ ] Python 3.11+ installed
- [ ] AWS CDK installed: `npm install -g aws-cdk`
- [ ] CDK version verified: `cdk --version`
- [ ] Docker installed (for Lambda layer packaging)
- [ ] PostgreSQL client installed (optional, for database access)
- [ ] Postman installed (for API testing)

### Code Setup
- [ ] GitHub repository cloned
- [ ] `infrastructure/` folder created
- [ ] Python virtual environment created
- [ ] Dependencies installed: `pip install -r infrastructure/cdk/requirements.txt`
- [ ] Account ID updated in `infrastructure/cdk/app.py`

### AWS Bootstrap
- [ ] Bootstrap CDK: `cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1`
- [ ] Service quotas checked (Lambda, RDS)
- [ ] Billing alarm set (optional but recommended)

---

## 🏗️ Deployment Steps (During Hackathon)

### Hour 0-1: Initial Deployment

#### 1. Synthesize Templates
```bash
cd infrastructure/cdk
source .venv/bin/activate
cdk synth
```
- [ ] No synthesis errors
- [ ] `.cdk.out/` folder created
- [ ] CloudFormation templates visible

#### 2. Deploy All Stacks
```bash
cdk deploy --all --require-approval never
```
**Expected time: 15-20 minutes**

- [ ] VpcStack deployed (2-3 min)
- [ ] StorageStack deployed (1-2 min)
- [ ] DatabaseStack deployed (5-8 min) ⏱️ LONGEST
- [ ] LambdaStack deployed (3-4 min)
- [ ] ApiStack deployed (1-2 min)

#### 3. Verify Deployments
```bash
# Check CloudFormation stacks
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE

# Should show 5 stacks:
# - OnboardingHubVpcStack
# - OnboardingHubStorageStack
# - OnboardingHubDatabaseStack
# - OnboardingHubLambdaStack
# - OnboardingHubApiStack
```
- [ ] All 5 stacks show CREATE_COMPLETE
- [ ] No ROLLBACK status

---

### Hour 1-2: Database Initialization

#### 1. Get Database Credentials
```bash
# Get database endpoint
export DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
  --output text)

# Get secret ARN
export DB_SECRET_ARN=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseSecretArn'].OutputValue" \
  --output text)

# Get password
export DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id $DB_SECRET_ARN \
  --query SecretString --output text | jq -r .password)

echo "Database Endpoint: $DB_ENDPOINT"
echo "Password: $DB_PASSWORD"
```
- [ ] Database endpoint retrieved
- [ ] Password retrieved

#### 2. Initialize Schema (Option A: RDS Query Editor - RECOMMENDED)
1. Go to AWS Console → RDS → Query Editor
2. Select cluster: `onboardinghubdatabasestack-vendordatabase`
3. Database name: `onboarding_hub`
4. Username: `postgres`
5. Use Secrets Manager secret
6. Copy paste `infrastructure/database/schema.sql` and execute
7. Copy paste `infrastructure/database/seed.sql` and execute

- [ ] Schema created (6 tables + views)
- [ ] Sample data inserted (5 vendors)

#### 2. Initialize Schema (Option B: psql client)
```bash
psql -h $DB_ENDPOINT -U postgres -d onboarding_hub

# Then run:
\i infrastructure/database/schema.sql
\i infrastructure/database/seed.sql
\q
```
- [ ] Schema created successfully
- [ ] Sample data loaded

#### 3. Verify Database
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Should show: vendors, documents, risk_scores, esg_questionnaires, audit_logs, approval_workflows

-- Check sample data
SELECT COUNT(*) FROM vendors;  -- Should return 5
```
- [ ] All tables exist
- [ ] Sample data loaded (5 vendors)

---

### Hour 2-3: API Testing

#### 1. Get API URL
```bash
export API_URL=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubApiStack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text)

echo "API URL: $API_URL"
```
- [ ] API URL retrieved
- [ ] URL format: `https://XXXXX.execute-api.us-east-1.amazonaws.com/prod/`

#### 2. Test Endpoints

**Test 1: Create Vendor**
```bash
curl -X POST ${API_URL}vendors \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Corp",
    "contact_email": "test@example.com",
    "ein": "99-9999999",
    "address": "123 Test St"
  }'

# Save the returned "id"
export VENDOR_ID="paste-uuid-here"
```
- [ ] Returns 201 status
- [ ] Returns vendor ID
- [ ] Returns KY3P and SLP IDs

**Test 2: Get Status**
```bash
curl -X GET ${API_URL}vendors/${VENDOR_ID}/status
```
- [ ] Returns 200 status
- [ ] Shows vendor info
- [ ] Shows document list (initially empty)

**Test 3: Get Upload URL**
```bash
curl -X POST ${API_URL}documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": "'$VENDOR_ID'",
    "document_type": "w9",
    "filename": "test.pdf"
  }'
```
- [ ] Returns 200 status
- [ ] Returns presigned URL
- [ ] Returns document ID

**Test 4: Calculate Risk Score**
```bash
curl -X POST ${API_URL}vendors/${VENDOR_ID}/risk-score
```
- [ ] Returns 200 status
- [ ] Returns overall score
- [ ] Returns breakdown (financial, compliance, cyber, ESG)
- [ ] Returns sanctions screening result

**Test 5: Approve Vendor**
```bash
curl -X POST ${API_URL}vendors/${VENDOR_ID}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "comments": "Test approval",
    "approver_email": "admin@gs.com"
  }'
```
- [ ] Returns 200 status
- [ ] Vendor status updated to "approved"

---

### Hour 3-4: Team Integration

#### 1. Share with Person 2 (Frontend)
Create `.env.frontend` file:
```bash
cat > .env.frontend <<EOF
REACT_APP_API_URL=${API_URL}
REACT_APP_AWS_REGION=us-east-1
EOF
```
- [ ] API URL shared
- [ ] Endpoint documentation shared (see QUICK_REFERENCE.md)
- [ ] CORS verified working

#### 2. Share with Person 3 (AI/ML)
Create `.env.ai` file:
```bash
export S3_BUCKET=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubStorageStack \
  --query "Stacks[0].Outputs[?OutputKey=='DocumentBucketName'].OutputValue" \
  --output text)

cat > .env.ai <<EOF
S3_BUCKET=$S3_BUCKET
AWS_REGION=us-east-1
TEXTRACT_ENABLED=true
COMPREHEND_ENABLED=true
EOF
```
- [ ] S3 bucket name shared
- [ ] Lambda function names shared
- [ ] Integration points explained

#### 3. Share with Person 4 (Backend)
Create `.env.backend` file:
```bash
cat > .env.backend <<EOF
DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@${DB_ENDPOINT}:5432/onboarding_hub
DB_HOST=${DB_ENDPOINT}
DB_NAME=onboarding_hub
DB_USER=postgres
DB_PASSWORD=${DB_PASSWORD}
EOF
```
- [ ] Database connection string shared
- [ ] Schema documentation shared (schema.sql)
- [ ] Sample queries provided

---

## 📊 Monitoring & Debugging

### CloudWatch Logs
```bash
# Tail all Lambda logs in separate terminals
aws logs tail /aws/lambda/OnboardingHubLambdaStack-CreateVendorHandler --follow
aws logs tail /aws/lambda/OnboardingHubLambdaStack-UploadHandler --follow
aws logs tail /aws/lambda/OnboardingHubLambdaStack-StatusHandler --follow
aws logs tail /aws/lambda/OnboardingHubLambdaStack-RiskScoreHandler --follow
aws logs tail /aws/lambda/OnboardingHubLambdaStack-ApproveHandler --follow
```
- [ ] Lambda logs accessible
- [ ] No error messages in logs

### CloudTrail
```bash
# View recent events
aws cloudtrail lookup-events --max-results 20
```
- [ ] CloudTrail showing events
- [ ] S3 PutObject events visible

---

## 🎬 Demo Preparation

### Screenshots to Capture
- [ ] VPC diagram (AWS Console → VPC → Resource Map)
- [ ] S3 bucket with KMS encryption (S3 → Bucket → Properties)
- [ ] KMS customer-managed key (KMS → Customer managed keys)
- [ ] CloudTrail event history (CloudTrail → Event history)
- [ ] Lambda functions list (Lambda → Functions)
- [ ] API Gateway resources (API Gateway → APIs → Resources)
- [ ] RDS Aurora cluster (RDS → Databases)
- [ ] CloudWatch metrics/dashboard

### Metrics to Collect
- [ ] Lambda invocation count
- [ ] API Gateway request count
- [ ] Average Lambda duration
- [ ] Database connection count
- [ ] Total deployment cost estimate

### Documentation
- [ ] Architecture diagram prepared (ARCHITECTURE.md)
- [ ] API endpoint list with examples
- [ ] Security features documented
- [ ] Cost breakdown calculated

---

## ✅ Pre-Demo Checklist

**Infrastructure:**
- [ ] All 5 stacks deployed successfully
- [ ] Database schema initialized
- [ ] Sample data seeded
- [ ] All API endpoints tested

**Security:**
- [ ] KMS encryption visible in S3 console
- [ ] VPC diagram shows 3-tier architecture
- [ ] CloudTrail enabled and logging
- [ ] No public database access

**Team Coordination:**
- [ ] Frontend has API URL
- [ ] AI/ML team has S3 bucket name
- [ ] Backend team has database credentials
- [ ] All integration points documented

**Demo Materials:**
- [ ] Architecture diagrams ready
- [ ] AWS Console screenshots captured
- [ ] Metrics collected
- [ ] Talking points prepared

**Backup Plans:**
- [ ] Demo video recorded (in case live fails)
- [ ] Postman collection ready
- [ ] Sample API responses saved

---

## 🚨 Troubleshooting

### Problem: Stack deployment fails
**Solution:**
```bash
# Check detailed error
aws cloudformation describe-stack-events --stack-name STACK_NAME

# If needed, delete and redeploy
cdk destroy STACK_NAME --force
cdk deploy STACK_NAME
```

### Problem: Lambda can't connect to database
**Solution:**
- Check Lambda is in VPC private subnet
- Verify RDS security group allows Lambda security group
- Test with this code in Lambda:
```python
import socket
print(socket.getaddrinfo("DB_ENDPOINT", 5432))
```

### Problem: API returns 502 Bad Gateway
**Solution:**
- Check Lambda logs for errors
- Verify Lambda timeout is sufficient (30s+)
- Check Lambda has database permissions

### Problem: Database connection timeout
**Solution:**
- Use RDS Query Editor instead of psql
- Or deploy a bastion host in public subnet
- Or use Systems Manager Session Manager

---

## 📞 Emergency Contacts

- **AWS Support**: https://console.aws.amazon.com/support
- **CDK GitHub Issues**: https://github.com/aws/aws-cdk/issues
- **Team Slack**: #hackutd-infrastructure
- **Me (Person 1)**: [Your contact info]

---

## ⏱️ Timeline Tracker

| Time | Milestone | Status |
|------|-----------|--------|
| Hour 0 | Project setup complete | ⏳ |
| Hour 1 | All stacks deployed | ⏳ |
| Hour 2 | Database initialized | ⏳ |
| Hour 3 | APIs tested successfully | ⏳ |
| Hour 4 | Team integration complete | ⏳ |
| Hour 16 | Demo prep complete | ⏳ |
| Hour 22 | Demo rehearsal | ⏳ |
| Hour 24 | Submit! | ⏳ |

---

## 🎯 Success Criteria

You know you're ready when:
- ✅ All 5 API endpoints return successful responses
- ✅ Database has sample data
- ✅ Frontend can call your APIs
- ✅ Screenshots captured showing security features
- ✅ Team members have what they need to integrate

---

**Good luck! You've got this! 🚀**
