import * as batch from '@aws-cdk/aws-batch-alpha';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

const MY_JOB_QUEUE_NAME = 'my-job-queue-name';
const MY_JOB_NAME = 'my-job-name';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'vpc');

    const stsAssumeRoleStatement = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['sts:AssumeRole'],
      resources: ['*'],
    });

    const batchServiceRole = new iam.Role(this, 'BatchServiceRole', {
      assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSBatchServiceRole',
        ),
      ],
    });
    batchServiceRole.addToPolicy(stsAssumeRoleStatement);

    const instanceRole = new iam.Role(this, 'InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonEC2ContainerServiceforEC2Role',
        ),
      ],
    });
    instanceRole.addToPolicy(stsAssumeRoleStatement);

    const instanceProfile = new iam.CfnInstanceProfile(
      this,
      'InstanceProfile',
      {
        roles: [instanceRole.roleName],
      },
    );

    const networkEnhancedComputeEnvironment = new batch.ComputeEnvironment(
      this,
      'BarraDataEtlNetworkEnhancedEnv',
      {
        computeEnvironmentName: 'barra-data-etl-network-enhanced-env',
        computeResources: {
          minvCpus: 0,
          maxvCpus: 100,
          instanceTypes: [
            new ec2.InstanceType('c5n.xlarge'), // 4 vCPUs | Up to 25 Gigabit
            new ec2.InstanceType('m5n.xlarge'), // 4 vCPUs | Up to 25 Gigabit
            new ec2.InstanceType('inf1.xlarge'), // 4 vCPUs | Up to 25 Gigabit
            new ec2.InstanceType('r5n.xlarge'), // 4 vCPUs | Up to 25 Gigabit
            new ec2.InstanceType('m5zn.xlarge'), // 4 vCPUs | Up to 25 Gigabit
          ],
          instanceRole: instanceProfile.attrArn,
          type: batch.ComputeResourceType.ON_DEMAND,
          vpc,
        },
        serviceRole: batchServiceRole,
      },
    );

    const repository = ecr.Repository.fromRepositoryName(
      this,
      'BarraDataEtlRepository',
      'barra-data-etl',
    );
    const image = ecs.ContainerImage.fromEcrRepository(repository);

    // Job Queue
    const jobQueue = new batch.JobQueue(this, MY_JOB_QUEUE_NAME, {
      jobQueueName: MY_JOB_QUEUE_NAME,
      priority: 1,
      computeEnvironments: [
        {
          order: 1,
          computeEnvironment: networkEnhancedComputeEnvironment,
        },
      ],
    });

    // Job Definitions
    const jobDef = new batch.JobDefinition(this, MY_JOB_NAME, {
      jobDefinitionName: MY_JOB_NAME,
      container: {
        command: ['node', 'main', 'Ref::command'],
        image,
        vcpus: 4,
        memoryLimitMiB: 4096,
        logConfiguration: {
          logDriver: batch.LogDriver.AWSLOGS,
        },
      },
      retryAttempts: 2,
      timeout: Duration.minutes(180),
    });
  }
}
