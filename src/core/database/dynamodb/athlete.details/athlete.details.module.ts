import { Module, DynamicModule } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './athlete.details.repo';
import { DDBAthleteDetailsRepositoryTransformers } from './athlete.details.transformers';
import { IDynamoDBService } from 'core/aws/aws.services.interface';

const Repo = DDBAthleteDetailsRepository;
const Transformer = DDBAthleteDetailsRepositoryTransformers;
type TransformerType = DDBAthleteDetailsRepositoryTransformers;

//#region factory
function repoFactory(dynamodbService: IDynamoDBService) {
    return [
        {
            provide: Repo,
            useFactory: (transformer: TransformerType) => {
                return new Repo(dynamodbService, transformer);
            },
            inject: [Transformer],
        },
    ];
}
//#endregion

@Module({
    imports: [],
    providers: [DDBAthleteDetailsRepositoryTransformers],
    exports: [DDBAthleteDetailsRepositoryTransformers],
})
export class DDBAthleteDetailsRepoModule {
    static withConfig(dynamodbService: IDynamoDBService): DynamicModule {
        const providers = repoFactory(dynamodbService);
        return {
            module: DDBAthleteDetailsRepoModule,
            providers: providers,
            exports: providers,
        };
    }
}
