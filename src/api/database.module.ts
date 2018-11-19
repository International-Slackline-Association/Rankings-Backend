import { Module } from '@nestjs/common';
import { DatabaseModule as DB } from 'core/database/database.module';
import { DynamoDBServices } from 'core/aws/aws.services';

/**
 * Initialize Database to inject to all the providers later
 */
@Module({
  imports: [DB.withConfig(new DynamoDBServices())],
  exports: [DatabaseModule],
})
export class DatabaseModule {}
