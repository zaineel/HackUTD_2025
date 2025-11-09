# Goldman Sachs Vendor Onboarding Hub - Infrastructure

## 🏗️ Architecture Overview

This infrastructure deploys a complete AWS serverless architecture for the Secure & Intelligent Onboarding Hub using AWS CDK.

### Key Components:
- **VPC**: Multi-tier network with public/private/isolated subnets
- **S3 + KMS**: Customer-managed encryption for document storage
- **RDS Aurora**: PostgreSQL Serverless database
- **Lambda Functions**: Serverless compute for business logic
- **API Gateway**: REST API for frontend integration
- **CloudWatch**: Logging and monitoring
- **CloudTrail**: Audit logging

---

## 📋 Prerequisites

### 1. AWS Account Setup
```bash
# Install AWS CLI
brew install awscli  # macOS
# or download from: https://aws.amazon.com/cli/

# Configure AWS credentials
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region: us-east-1
# - Default output format: json
```

### 2. Install Dependencies
```bash
# Install Node.js (for AWS CDK)
brew install node  # macOS

# Install AWS CDK
npm install -g aws-cdk

# Verify installation
cdk --version

# Install Python dependencies
cd infrastructure/cdk
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Bootstrap CDK (First Time Only)
```bash
# Bootstrap your AWS account for CDK
cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1
```

---

## 🚀 Deployment Steps

### Step 1: Update Configuration
Edit `infrastructure/cdk/app.py` and replace:
```python
env = cdk.Environment(
    account="YOUR_AWS_ACCOUNT_ID",  # ← Replace this
    region="us-east-1"
)
```

Get your account ID:
```bash
aws sts get-caller-identity --query Account --output text
```

### Step 2: Synthesize CloudFormation Templates
```bash
cd infrastructure/cdk
source .venv/bin/activate

# Generate CloudFormation templates
cdk synth

# This creates .cdk.out/ folder with templates
```

### Step 3: Deploy Stacks (In Order)

**Deploy all stacks at once (recommended for hackathon):**
```bash
cdk deploy --all --require-approval never
```

**Or deploy individually:**
```bash
# 1. VPC (2-3 minutes)
cdk deploy OnboardingHubVpcStack

# 2. Storage (1-2 minutes)
cdk deploy OnboardingHubStorageStack

# 3. Database (5-8 minutes) ⏱️ LONGEST STEP
cdk deploy OnboardingHubDatabaseStack

# 4. Lambda Functions (3-4 minutes)
cdk deploy OnboardingHubLambdaStack

# 5. API Gateway (1-2 minutes)
cdk deploy OnboardingHubApiStack
```

**Total deployment time: ~15-20 minutes**

### Step 4: Initialize Database Schema
```bash
# Get database endpoint from outputs
DB_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseEndpoint'].OutputValue" \
  --output text)

# Get database password
DB_SECRET_ARN=$(aws cloudformation describe-stacks \
  --stack-name OnboardingHubDatabaseStack \
  --query "Stacks[0].Outputs[?OutputKey=='DatabaseSecretArn'].OutputValue" \
  --output text)

DB_PASSWORD=$(aws secretsmanager get-secret-value \
  --secret-id $DB_SECRET_ARN \
  --query SecretString --output text | jq -r .password)

# Connect to database (requires psql client)
psql -h $DB_ENDPOINT -U postgres -d onboarding_hub

# Then run:
\i ../database/schema.sql
\i ../database/seed.sql
```

**Alternative: Use RDS Query Editor in AWS Console**
1. Go to RDS → Query Editor
2. Select the onboarding_hub cluster
3. Paste contents of schema.sql and execute
4. Paste contents of seed.sql and execute

### Step 5: Get API URL
```bash
# Get API Gateway URL
aws cloudformation describe-stacks \
  --stack-name OnboardingHubApiStack \
  --query "Stacks[0].Outputs[?OutputKey=='ApiUrl'].OutputValue" \
  --output text

# Example output: https://abc123xyz.execute-api.us-east-1.amazonaws.com/prod/
```

---

## 🧪 Testing

### Test with cURL

**1. Create a vendor:**
```bash
API_URL="YOUR_API_URL"  # From Step 5

curl -X POST ${API_URL}vendors \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "Test Vendor Inc",
    "contact_email": "test@example.com",
    "ein": "12-3456789",
    "address": "123 Test St, San Francisco, CA"
  }'

# Save the returned "id" for next steps
VENDOR_ID="uuid-from-response"
```

**2. Get upload URL:**
```bash
curl -X POST ${API_URL}documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "vendor_id": "'$VENDOR_ID'",
    "document_type": "w9",
    "filename": "w9_form.pdf"
  }'
```

**3. Get vendor status:**
```bash
curl -X GET ${API_URL}vendors/${VENDOR_ID}/status
```

**4. Calculate risk score:**
```bash
curl -X POST ${API_URL}vendors/${VENDOR_ID}/risk-score
```

**5. Approve vendor:**
```bash
curl -X POST ${API_URL}vendors/${VENDOR_ID}/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approved": true,
    "comments": "All checks passed",
    "approver_email": "reviewer@gs.com"
  }'
```

### Test with Postman

1. Import the Postman collection: `docs/postman_collection.json` (create this)
2. Set `{{api_url}}` variable to your API URL
3. Run the collection

---

## 📊 Monitoring & Logs

### CloudWatch Logs
```bash
# View Lambda logs
aws logs tail /aws/lambda/OnboardingHubLambdaStack-CreateVendorHandler --follow

# View API Gateway logs
aws logs tail API-Gateway-Execution-Logs_YOUR_API_ID/prod --follow
```

### CloudTrail Audit Logs
```bash
# View recent API calls
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=PutObject \
  --max-results 10
```

### AWS Console
- **Lambda**: https://console.aws.amazon.com/lambda
- **RDS**: https://console.aws.amazon.com/rds
- **S3**: https://console.aws.amazon.com/s3
- **API Gateway**: https://console.aws.amazon.com/apigateway
- **CloudWatch**: https://console.aws.amazon.com/cloudwatch

---

## 🔒 Security Features (For Demo)

### 1. Customer-Managed KMS Key
```bash
# View KMS key in console
aws kms list-keys
aws kms describe-key --key-id YOUR_KEY_ID
```

**Demo Screenshot**: Show S3 bucket properties with KMS encryption enabled

### 2. VPC Isolation
**Demo Screenshot**: Show VPC diagram with 3 subnet tiers

### 3. CloudTrail Audit Logs
```bash
# Show recent events
aws cloudtrail lookup-events --max-results 20
```

**Demo Screenshot**: CloudTrail event history

---

## 🧹 Cleanup (After Hackathon)

```bash
# Delete all stacks (reverse order)
cdk destroy --all

# Verify deletion
aws cloudformation list-stacks --stack-status-filter DELETE_COMPLETE
```

**Note**: This will permanently delete:
- All vendor data in RDS
- All documents in S3
- All Lambda functions
- The entire VPC

---

## 📁 Project Structure

```
infrastructure/
├── cdk/
│   ├── app.py                    # CDK entry point
│   ├── cdk.json                  # CDK config
│   ├── requirements.txt           # Python dependencies
│   └── stacks/
│       ├── vpc_stack.py           # VPC, subnets, security groups
│       ├── storage_stack.py       # S3, KMS
│       ├── database_stack.py      # RDS Aurora
│       ├── lambda_stack.py        # Lambda functions
│       └── api_stack.py           # API Gateway
├── lambda/
│   ├── upload_handler/            # Presigned URL generation
│   ├── create_vendor/             # Create vendor endpoint
│   ├── status_handler/            # Get vendor status
│   ├── risk_scoring/              # Risk calculation
│   └── approve_vendor/            # Approval workflow
├── database/
│   ├── schema.sql                 # Database schema
│   └── seed.sql                   # Sample data
└── docs/
    └── README.md                  # This file
```

---

## 🎯 API Endpoints

### Base URL
`https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/`

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vendors` | Create new vendor |
| GET | `/vendors/{id}/status` | Get onboarding status |
| GET | `/vendors/{id}/risk-score` | Get risk assessment |
| POST | `/vendors/{id}/risk-score` | Calculate risk score |
| POST | `/vendors/{id}/approve` | Approve/reject vendor |
| POST | `/documents/upload` | Get presigned upload URL |

---

## 🐛 Troubleshooting

### Issue: CDK deploy fails with "Account not bootstrapped"
**Solution:**
```bash
cdk bootstrap aws://YOUR_ACCOUNT_ID/us-east-1
```

### Issue: Lambda can't connect to RDS
**Solution:** Check security groups
```bash
# Lambda should be in VPC private subnet
# RDS security group should allow Lambda security group on port 5432
```

### Issue: "No space left on device" during deployment
**Solution:** Clean up Docker images
```bash
docker system prune -a
```

### Issue: Database connection timeout
**Solution:** Use RDS Query Editor or deploy a bastion host

---

## 👥 Team Integration

### For Person 2 (Frontend):
- **API URL**: Share from Step 5
- **Endpoints**: See API Endpoints section above
- **CORS**: Already configured to allow all origins

### For Person 3 (AI/ML):
- **S3 Bucket**: Get from CloudFormation outputs
- **Textract/Comprehend**: Already configured in risk_scoring Lambda
- **Integration**: Add your code to `lambda/risk_scoring/index.py`

### For Person 4 (Backend):
- **Database**: Connection details in CloudFormation outputs
- **Schema**: See `database/schema.sql`
- **Sample Queries**: See `database/seed.sql`

---

## ⚡ Quick Start (TL;DR)

```bash
# 1. Install dependencies
npm install -g aws-cdk
pip install -r infrastructure/cdk/requirements.txt

# 2. Configure AWS
aws configure

# 3. Update account ID in app.py

# 4. Bootstrap (first time only)
cdk bootstrap

# 5. Deploy everything
cd infrastructure/cdk
cdk deploy --all --require-approval never

# 6. Initialize database (use RDS Query Editor)

# 7. Test API
curl https://YOUR_API_URL/vendors -X POST -H "Content-Type: application/json" -d '{"company_name": "Test", "contact_email": "test@example.com"}'
```

---

## 📞 Support

- **AWS CDK Docs**: https://docs.aws.amazon.com/cdk/
- **AWS Console**: https://console.aws.amazon.com/
- **Team Slack**: #hack-utd-infrastructure
