import { Module, DynamicModule } from '@nestjs/common';
// import { RankingsRepository } from './dynamodb/rankings.repo';
import { DatabaseService } from './database.service';
import { DDBAthleteDetailsRepoModule } from './dynamodb/athlete.details/athlete.details.module';
import { IDynamoDBService } from 'core/aws/aws.services.interface';

@Module({
    imports: [],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {
    static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [DDBAthleteDetailsRepoModule.withConfig(dynamodbService)],
        };
    }
}
