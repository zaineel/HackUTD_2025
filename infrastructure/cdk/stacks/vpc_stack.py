"""
VPC Stack - Network infrastructure with public/private/isolated subnets
"""
from aws_cdk import (
    Stack,
    aws_ec2 as ec2,
    CfnOutput,
)
from constructs import Construct

class VpcStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create VPC with 3 tiers: public, private, isolated
        self.vpc = ec2.Vpc(
            self, "OnboardingHubVPC",
            vpc_name="onboarding-hub-vpc",
            ip_addresses=ec2.IpAddresses.cidr("10.0.0.0/16"),
            max_azs=2,  # Use 2 availability zones for high availability
            nat_gateways=1,  # 1 NAT gateway to save costs during hackathon
            subnet_configuration=[
                # Public subnet - for API Gateway, Load Balancers
                ec2.SubnetConfiguration(
                    name="Public",
                    subnet_type=ec2.SubnetType.PUBLIC,
                    cidr_mask=24,
                ),
                # Private subnet - for Lambda functions, application logic
                ec2.SubnetConfiguration(
                    name="Private",
                    subnet_type=ec2.SubnetType.PRIVATE_WITH_EGRESS,
                    cidr_mask=24,
                ),
                # Isolated subnet - for RDS database (no internet access)
                ec2.SubnetConfiguration(
                    name="Isolated",
                    subnet_type=ec2.SubnetType.PRIVATE_ISOLATED,
                    cidr_mask=24,
                ),
            ],
            enable_dns_hostnames=True,
            enable_dns_support=True,
        )

        # Security group for Lambda functions
        self.lambda_security_group = ec2.SecurityGroup(
            self, "LambdaSecurityGroup",
            vpc=self.vpc,
            description="Security group for Lambda functions",
            allow_all_outbound=True,
        )

        # Security group for RDS database
        self.rds_security_group = ec2.SecurityGroup(
            self, "RdsSecurityGroup",
            vpc=self.vpc,
            description="Security group for RDS database",
            allow_all_outbound=False,
        )

        # Allow Lambda to connect to RDS on PostgreSQL port (5432)
        self.rds_security_group.add_ingress_rule(
            peer=self.lambda_security_group,
            connection=ec2.Port.tcp(5432),
            description="Allow Lambda functions to access RDS",
        )

        # VPC Endpoints for AWS services (saves money on data transfer)
        self.vpc.add_gateway_endpoint(
            "S3Endpoint",
            service=ec2.GatewayVpcEndpointAwsService.S3,
        )

        # Outputs
        CfnOutput(
            self, "VpcId",
            value=self.vpc.vpc_id,
            description="VPC ID for the onboarding hub",
            export_name="OnboardingHubVpcId",
        )

        CfnOutput(
            self, "LambdaSgId",
            value=self.lambda_security_group.security_group_id,
            description="Security Group ID for Lambda functions",
            export_name="OnboardingHubLambdaSgId",
        )

        CfnOutput(
            self, "RdsSgId",
            value=self.rds_security_group.security_group_id,
            description="Security Group ID for RDS database",
            export_name="OnboardingHubRdsSgId",
        )
