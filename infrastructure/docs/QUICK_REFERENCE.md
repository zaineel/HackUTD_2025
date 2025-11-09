# Quick Reference Guide

## 🚀 Deployment Commands

```bash
# Deploy everything
cd infrastructure/cdk
cdk deploy --all --require-approval never

# Deploy specific stack
cdk deploy OnboardingHubVpcStack

# View what will be deployed
cdk diff

# Delete everything
cdk destroy --all
```

---

## 📡 Get Deployment Info

```bash
# Get API URL
aws cloudformation describe-stacks \
  --stack-name OnboardingHubApiStack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text

# Get Database Endpoint
aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
  --output text

# Get S3 Bucket Name
aws cloudformation describe-stacks \
  --stack-name OnboardingHubStorageStack \
  --query "Stacks[0].Outputs[?OutputKey=='DocumentBucketName'].OutputValue" \
  --output text

# Get KMS Key ID
aws cloudformation describe-stacks \
  --stack-name OnboardingHubStorageStack \
  --query "Stacks[0].Outputs[?OutputKey=='KmsKeyId'].OutputValue" \
  --output text
```

---

## 🧪 API Testing Commands

### 1. Create Vendor
```bash
API_URL="https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/"

curl -X POST ${API_URL}vendors \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Demo Vendor Inc",
    "contact_email": "demo@vendor.com",
    "ein": "12-3456789",
    "address": "123 Main St, SF, CA 94105",
    "contact_phone": "+1-415-555-0100"
  }'

# Save the "id" from response
VENDOR_ID="paste-uuid-here"
```

### 2. Get Upload URL
```bash
curl -X POST ${API_URL}documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": "'$VENDOR_ID'",
    "document_type": "w9",
    "filename": "w9_form.pdf"
  }'
```

### 3. Check Status
```bash
curl -X GET ${API_URL}vendors/${VENDOR_ID}/status | jq
```

### 4. Calculate Risk Score
```bash
curl -X POST ${API_URL}vendors/${VENDOR_ID}/risk-score | jq
```

### 5. Get Risk Score
```bash
curl -X GET ${API_URL}vendors/${VENDOR_ID}/risk-score | jq
```

### 6. Approve Vendor
```bash
curl -X POST ${API_URL}vendors/${VENDOR_ID}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "comments": "All documentation verified",
    "approver_email": "reviewer@gs.com"
  }' | jq
```

---

## 📊 Database Queries

### Connect to Database
```bash
# Get credentials
DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
  --output text)

DB_SECRET_ARN=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseSecretArn'].OutputValue" \
  --output text)

DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id $DB_SECRET_ARN \
  --query SecretString --output text | jq -r .password)

# Connect
psql -h $DB_ENDPOINT -U postgres -d onboarding_hub
```

### Useful Queries
```sql
-- View all vendors
SELECT id, company_name, status, onboarding_progress
FROM vendors
ORDER BY created_at DESC;

-- View vendor dashboard (includes docs and risk scores)
SELECT * FROM vendor_dashboard;

-- View high-risk vendors
SELECT * FROM high_risk_vendors;

-- View recent audit logs
SELECT vendor_id, action, actor, timestamp
FROM audit_logs
ORDER BY timestamp DESC
LIMIT 20;

-- Get vendor with all related data
SELECT
  v.company_name,
  v.status,
  v.onboarding_progress,
  COUNT(d.id) as doc_count,
  rs.overall_score,
  rs.risk_level
FROM vendors v
LEFT JOIN documents d ON v.id = d.vendor_id
LEFT JOIN risk_scores rs ON v.id = rs.vendor_id
WHERE v.id = 'VENDOR_ID_HERE'
GROUP BY v.id, rs.overall_score, rs.risk_level;
```

---

## 📝 CloudWatch Logs

### Tail Lambda Logs
```bash
# Upload Handler
aws logs tail /aws/lambda/OnboardingHubLambdaStack-UploadHandler --follow

# Create Vendor
aws logs tail /aws/lambda/OnboardingHubLambdaStack-CreateVendorHandler --follow

# Risk Scoring
aws logs tail /aws/lambda/OnboardingHubLambdaStack-RiskScoreHandler --follow

# Status Handler
aws logs tail /aws/lambda/OnboardingHubLambdaStack-StatusHandler --follow

# Approve Handler
aws logs tail /aws/lambda/OnboardingHubLambdaStack-ApproveHandler --follow
```

### View API Gateway Logs
```bash
API_ID=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubApiStack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiId'].OutputValue" \
  --output text)

aws logs tail /aws/apigateway/${API_ID}/prod --follow
```

---

## 🔍 Debugging

### Lambda Function Errors
```bash
# Check Lambda metrics
aws lambda get-function --function-name OnboardingHubLambdaStack-CreateVendorHandler

# Invoke Lambda directly for testing
aws lambda invoke \
  --function-name OnboardingHubLambdaStack-CreateVendorHandler \
  --payload '{"body": "{\"company_name\":\"Test\",\"contact_email\":\"test@example.com\"}"}' \
  response.json

cat response.json
```

### Database Connection Issues
```bash
# Check security group rules
aws ec2 describe-security-groups \
  --filters "Name=tag:aws:cloudformation:stack-name,Values=OnboardingHubVpcStack"

# Test from Lambda
# Add this to any Lambda function temporarily:
import socket
socket.getaddrinfo("your-db-endpoint.rds.amazonaws.com", 5432)
```

### S3 Access Issues
```bash
# List objects in bucket
BUCKET=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubStorageStack \
  --query "Stacks[0].Outputs[?OutputKey=='DocumentBucketName'].OutputValue" \
  --output text)

aws s3 ls s3://$BUCKET/ --recursive

# Check bucket encryption
aws s3api get-bucket-encryption --bucket $BUCKET
```

---

## 🎯 Demo Preparation

### Screenshots to Take
1. **VPC Diagram**: VPC Console → Your VPCs → Select VPC → Resource Map
2. **S3 Encryption**: S3 Console → Bucket → Properties → Default encryption
3. **KMS Key**: KMS Console → Customer managed keys → Show key details
4. **CloudTrail Events**: CloudTrail Console → Event history
5. **Lambda Functions**: Lambda Console → Show all 5 functions
6. **API Gateway**: API Gateway Console → Show resources and methods
7. **RDS Cluster**: RDS Console → Show Aurora cluster running
8. **CloudWatch Dashboard**: Create custom dashboard with metrics

### Metrics to Capture
```bash
# Lambda invocation count
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Invocations \
  --dimensions Name=FunctionName,Value=OnboardingHubLambdaStack-CreateVendorHandler \
  --start-time 2025-11-08T00:00:00Z \
  --end-time 2025-11-08T23:59:59Z \
  --period 3600 \
  --statistics Sum

# API Gateway request count
aws cloudwatch get-metric-statistics \
  --namespace AWS/ApiGateway \
  --metric-name Count \
  --dimensions Name=ApiName,Value="Vendor Onboarding Hub API" \
  --start-time 2025-11-08T00:00:00Z \
  --end-time 2025-11-08T23:59:59Z \
  --period 3600 \
  --statistics Sum
```

---

## 🔒 Security Checklist

- [ ] S3 bucket has KMS encryption enabled
- [ ] S3 bucket blocks public access
- [ ] RDS is in isolated subnet (no internet)
- [ ] Lambda functions have least-privilege IAM roles
- [ ] API Gateway enforces HTTPS (TLS 1.2+)
- [ ] CloudTrail is enabled
- [ ] VPC flow logs enabled (optional)
- [ ] No hardcoded credentials in code
- [ ] Database password in Secrets Manager
- [ ] Security groups follow least-privilege

---

## 💡 Helpful AWS Console Links

- **Lambda**: https://console.aws.amazon.com/lambda
- **API Gateway**: https://console.aws.amazon.com/apigateway
- **RDS**: https://console.aws.amazon.com/rds
- **S3**: https://console.aws.amazon.com/s3
- **VPC**: https://console.aws.amazon.com/vpc
- **KMS**: https://console.aws.amazon.com/kms
- **CloudWatch**: https://console.aws.amazon.com/cloudwatch
- **CloudTrail**: https://console.aws.amazon.com/cloudtrail
- **CloudFormation**: https://console.aws.amazon.com/cloudformation

---

## 📞 Team Communication

### Share with Team (After Deployment)
```bash
# Get all outputs in one command
aws cloudformation describe-stacks \
  --stack-name OnboardingHubApiStack OnboardingHubStorageStack OnboardingHubDatabaseStack \
  --query 'Stacks[].Outputs[?OutputKey]' \
  --output table
```

### Export for Person 2 (Frontend)
```bash
echo "export API_URL=$(aws cloudformation describe-stacks --stack-name OnboardingHubApiStack --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" --output text)" > .env.frontend
```

### Export for Person 3 (AI/ML)
```bash
echo "S3_BUCKET=$(aws cloudformation describe-stacks --stack-name OnboardingHubStorageStack --query "Stacks[0].Outputs[?OutputKey=='DocumentBucketName'].OutputValue" --output text)" > .env.ai
```

### Export for Person 4 (Backend)
```bash
echo "DATABASE_URL=postgresql://postgres:$DB_PASSWORD@$DB_ENDPOINT:5432/onboarding_hub" > .env.backend
```

---

## ⚡ Emergency Commands

### Rollback Deployment
```bash
cdk destroy OnboardingHubApiStack --force
cdk deploy OnboardingHubApiStack
```

### Force Delete Stack
```bash
aws cloudformation delete-stack --stack-name OnboardingHubLambdaStack
```

### Clear All Lambda Logs
```bash
aws logs delete-log-group --log-group-name /aws/lambda/OnboardingHubLambdaStack-CreateVendorHandler
```

---

## ✅ Pre-Demo Checklist

- [ ] All stacks deployed successfully
- [ ] Database schema initialized
- [ ] Sample data seeded
- [ ] API endpoints tested (all 5)
- [ ] Screenshots captured
- [ ] Architecture diagram prepared
- [ ] Cost estimate calculated
- [ ] Team members have necessary credentials
- [ ] Backup video recorded
- [ ] Postman collection ready
