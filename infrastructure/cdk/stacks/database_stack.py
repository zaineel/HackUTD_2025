"""
Database Stack - Aurora PostgreSQL Serverless for vendor data
"""
from aws_cdk import (
    Stack,
    Duration,
    RemovalPolicy,
    aws_rds as rds,
    aws_ec2 as ec2,
    aws_secretsmanager as secretsmanager,
    CfnOutput,
)
from constructs import Construct

class DatabaseStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, vpc: ec2.Vpc, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create database credentials secret
        self.db_secret = secretsmanager.Secret(
            self, "DbCredentialsSecret",
            description="Master credentials for Aurora PostgreSQL database",
            generate_secret_string=secretsmanager.SecretStringGenerator(
                secret_string_template='{"username": "postgres"}',
                generate_string_key="password",
                exclude_characters="\"@/\\ '",
                password_length=32,
            ),
        )

        # Create Aurora Serverless v2 PostgreSQL cluster
        self.database = rds.DatabaseCluster(
            self, "VendorDatabase",
            engine=rds.DatabaseClusterEngine.aurora_postgres(
                version=rds.AuroraPostgresEngineVersion.VER_15_4
            ),
            credentials=rds.Credentials.from_secret(self.db_secret),
            default_database_name="onboarding_hub",
            vpc=vpc,
            vpc_subnets=ec2.SubnetSelection(
                subnet_type=ec2.SubnetType.PRIVATE_ISOLATED  # No internet access
            ),
            writer=rds.ClusterInstance.serverless_v2("writer",
                scale_with_writer=True
            ),
            readers=[
                # Optional: Add read replica for high availability
                # rds.ClusterInstance.serverless_v2("reader", scale_with_writer=True)
            ],
            serverless_v2_min_capacity=0.5,  # Minimum ACUs (Aurora Capacity Units)
            serverless_v2_max_capacity=2,    # Maximum ACUs (keep low for hackathon costs)
            backup=rds.BackupProps(
                retention=Duration.days(1),  # Minimal backup for hackathon
            ),
            cloudwatch_logs_exports=["postgresql"],  # Enable CloudWatch logs
            storage_encrypted=True,  # Encrypt data at rest
            removal_policy=RemovalPolicy.DESTROY,  # For hackathon
            deletion_protection=False,  # Allow deletion
        )

        # Outputs
        CfnOutput(
            self, "DatabaseEndpoint",
            value=self.database.cluster_endpoint.hostname,
            description="Aurora PostgreSQL cluster endpoint",
            export_name="OnboardingHubDatabaseEndpoint",
        )

        CfnOutput(
            self, "DatabasePort",
            value=str(self.database.cluster_endpoint.port),
            description="Database port",
            export_name="OnboardingHubDatabasePort",
        )

        CfnOutput(
            self, "DatabaseName",
            value="onboarding_hub",
            description="Default database name",
            export_name="OnboardingHubDatabaseName",
        )

        CfnOutput(
            self, "DatabaseSecretArn",
            value=self.db_secret.secret_arn,
            description="ARN of the secret containing database credentials",
            export_name="OnboardingHubDatabaseSecretArn",
        )
