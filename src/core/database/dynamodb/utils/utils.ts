import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logger } from 'shared/logger';
import { AWSError } from 'aws-sdk';

/**
 * Create dynamodb repository with transformers via dynamodb configuration
 * @param Repo RepositoryClass
 * @param Transformer TransformerClass
 * @param dynamodbService dynamodb configuration
 */
export function repositoryFactory(
  Repo,
  Transformer,
  dynamodbService: IDynamoDBService,
) {
  return {
    provide: Repo,
    useFactory: transformer => {
      return new Repo(dynamodbService, transformer);
    },
    inject: [Transformer],
  };
}

export function logDynamoDBError(
  errorDesc: string,
  err: AWSError,
  params: any,
) {
  logger.error(`DynamoDB Error: ${errorDesc}`, {
    params: params,
    error: err,
  });
}

export function logThrowDynamoDBError(errorDesc: string, params: any) {
  return (err: AWSError) => {
    logDynamoDBError(errorDesc, err, params);
    throw err;
  };
}

export function buildCompositeKey(base: string, ...params: string[]) {
  let str = base;
  for (const param of params) {
    if (param) {
      str = str + ':' + param;
    } else {
      break;
    }
  }
  return str + (str === base ? ':' : '');
}

export function destructCompositeKey(key: string, index: number): string {
  const token = key.split(':')[index];
  return token;
}
