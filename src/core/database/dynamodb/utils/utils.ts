import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logger } from 'shared/logger';
import { AWSError } from 'aws-sdk';
import { stringify } from 'querystring';

/**
 * Create dynamodb repository with transformers via dynamodb configuration
 * @param Repo RepositoryClass
 * @param Transformer TransformerClass
 * @param dynamodbService dynamodb configuration
 */
export function repositoryFactory(
  Repo,
  Transformers,
  dynamodbService: IDynamoDBService,
) {
  return {
    provide: Repo,
    useFactory: (...transformers) => {
      return new Repo(dynamodbService, ...transformers);
    },
    inject: Transformers instanceof Array ? Transformers : [Transformers],
  };
}

export function logDynamoDBError(
  errorDesc: string,
  err: AWSError,
  params: any,
) {
  let errMessage;
  if (!err.requestId) { // Not AWSError
    errMessage = err.message;
  }
  logger.error(`DynamoDB Error: ${errorDesc}`, {
    params: params,
    error: errMessage || err,
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
  if (!key) {
    return null;
  }
  const token = key.split(':')[index];
  return token;
}
