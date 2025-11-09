"""
Storage Stack - S3 bucket with customer-managed KMS encryption
"""
from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_s3 as s3,
    aws_kms as kms,
    aws_iam as iam,
    CfnOutput,
)
from constructs import Construct

class StorageStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create customer-managed KMS key for encryption
        # This is a key Goldman Sachs requirement!
        self.kms_key = kms.Key(
            self, "DocumentEncryptionKey",
            description="Customer-managed KMS key for vendor document encryption",
            enable_key_rotation=True,  # Auto-rotate keys annually for security
            removal_policy=RemovalPolicy.DESTROY,  # For hackathon - delete when stack is destroyed
            alias="onboarding-hub-document-key",
        )

        # Grant AWS services permission to use the key
        self.kms_key.grant_encrypt_decrypt(
            iam.ServicePrincipal("s3.amazonaws.com")
        )
        self.kms_key.grant_encrypt_decrypt(
            iam.ServicePrincipal("lambda.amazonaws.com")
        )

        # Create S3 bucket for document storage
        self.document_bucket = s3.Bucket(
            self, "VendorDocumentBucket",
            bucket_name=None,  # Auto-generate unique name
            encryption=s3.BucketEncryption.KMS,
            encryption_key=self.kms_key,  # Use customer-managed key
            versioned=True,  # Keep version history for compliance
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,  # No public access
            enforce_ssl=True,  # Require TLS 1.2+ for all requests
            removal_policy=RemovalPolicy.DESTROY,  # For hackathon
            auto_delete_objects=True,  # Clean up on stack deletion
            lifecycle_rules=[
                # Move old documents to cheaper storage after 90 days
                s3.LifecycleRule(
                    id="TransitionToInfrequentAccess",
                    enabled=True,
                    transitions=[
                        s3.Transition(
                            storage_class=s3.StorageClass.INFREQUENT_ACCESS,
                            transition_after=Duration.days(90),
                        )
                    ],
                ),
                # Delete old versions after 30 days
                s3.LifecycleRule(
                    id="DeleteOldVersions",
                    enabled=True,
                    noncurrent_version_expiration=Duration.days(30),
                ),
            ],
            cors=[
                # Allow frontend to upload documents directly
                s3.CorsRule(
                    allowed_methods=[
                        s3.HttpMethods.GET,
                        s3.HttpMethods.POST,
                        s3.HttpMethods.PUT,
                    ],
                    allowed_origins=["*"],  # In production, restrict to specific domain
                    allowed_headers=["*"],
                    max_age=3000,
                )
            ],
        )

        # Outputs
        CfnOutput(
            self, "DocumentBucketName",
            value=self.document_bucket.bucket_name,
            description="S3 bucket name for vendor documents",
            export_name="OnboardingHubDocumentBucket",
        )

        CfnOutput(
            self, "DocumentBucketArn",
            value=self.document_bucket.bucket_arn,
            description="S3 bucket ARN for vendor documents",
            export_name="OnboardingHubDocumentBucketArn",
        )

        CfnOutput(
            self, "KmsKeyId",
            value=self.kms_key.key_id,
            description="KMS key ID for document encryption",
            export_name="OnboardingHubKmsKeyId",
        )

        CfnOutput(
            self, "KmsKeyArn",
            value=self.kms_key.key_arn,
            description="KMS key ARN for document encryption",
            export_name="OnboardingHubKmsKeyArn",
        )
