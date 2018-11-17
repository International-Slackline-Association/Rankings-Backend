import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface DDBTableKeyAttrs {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LSI: string;
  readonly GSI_SK: string;
}

export interface LastEvaluatedKey {
  readonly PK: string;
  readonly SK_GSI: string;
  readonly LSI: string;
}

export type NumberSet = DocumentClient.DynamoDbSet;
