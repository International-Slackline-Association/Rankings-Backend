import { AWSError } from 'aws-sdk';
import { IDynamoDBService } from 'core/aws/aws.services.interface';
import { logger } from 'shared/logger';
import { Utils } from 'shared/utils';

/**
 * Create dynamodb repository with transformers via dynamodb configuration
 * @param Repo RepositoryClass
 * @param Transformer TransformerClass
 * @param dynamodbService dynamodb configuration
 */
export function repositoryFactory(Repo, dynamodbService: IDynamoDBService) {
  return {
    provide: Repo,
    useFactory: () => {
      return new Repo(dynamodbService);
    },
  };
}

export function logDynamoDBError(errorDesc: string, err: AWSError, params: any) {
  let errMessage;
  if (!err.requestId) {
    // Not AWSError
    errMessage = err.message;
  }
  logger.error(`DynamoDB Error: ${errorDesc}`, {
    data: {
      params: params,
      error: errMessage || err,
    },
  });
}

export function logThrowDynamoDBError(errorDesc: string, params: any) {
  return (err: AWSError) => {
    logDynamoDBError(errorDesc, err, params);
    throw err;
  };
}

export function buildCompositeKey(base: string, ...params: string[]) {
  const str = Utils.concatParams(base, ...params);
  return str + (str === base ? ':' : '');
}

export function destructCompositeKey(key: string, index: number): string {
  if (!key) {
    return null;
  }
  const token = key.split(':')[index];
  return token;
}

/** Encode numbers in string preserving their lexicographical order */
export function encodePointToString(point: number) {
  const digitCount = Math.max(Math.floor(Math.log10(Math.abs(point))), 0) + 1;
  // https://www.arangodb.com/2017/09/sorting-number-strings-numerically/
  const prefix = String.fromCodePoint(digitCount + 33) + ' ';
  return prefix + point.toString();
}

export function decodeStringToPoint(point: string) {
  return parseInt(point.split(' ')[1], 10);
}
