import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export type AttrsTransformer<T> = {
  [P in keyof T]: ((...params: string[]) => string)
};
export type AttrsTransformerOptional<T> = {
  [P in keyof T]?: ((...params: any[]) => any)
};
export type ItemTransformerOptional<T> = {
  [P in keyof T]?: ((...params: any[]) => any)
};

export abstract class DDBOverloadedTableTransformer<
  TAllAttrs,
  TTransformedItem
> {
  protected abstract attrsToItemTransformer: ItemTransformerOptional<
    TTransformedItem
  >;
  protected abstract itemToAttrsTransformer: AttrsTransformerOptional<
    TAllAttrs
  >;

  protected abstract transformAttrsToItem(
    dynamodbItem: TAllAttrs,
  ): TTransformedItem;

  protected abstract transformItemToAttrs(
    item: TTransformedItem,
    client?: DocumentClient,
  ): TAllAttrs;

  protected attrNameTyped<T>(attr: keyof T): string {
    return this.identity(attr);
  }

  public attrName(attr: keyof TAllAttrs): string {
    return this.identity(attr);
  }

  protected identity(x) {
    return x;
  }
}
