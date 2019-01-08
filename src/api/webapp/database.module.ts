import { Module } from '@nestjs/common';
import { DynamoDBServices } from 'core/aws/aws.services';
import { DatabaseModule as DB } from 'core/database/database.module';
import { ClientOpts } from 'redis';
import env_variables from 'shared/env_variables';

const redisOpts: ClientOpts = {
  host: env_variables.redis_host,
  port: parseInt(env_variables.redis_port, 10),
  password: env_variables.redis_password,
};

const dynamodbService = new DynamoDBServices();
/**
 * Initialize Database to inject to all the providers later
 */
@Module({
  imports: [DB.withConfig(dynamodbService, redisOpts)],
  exports: [DatabaseModule],
})
export class DatabaseModule {}
