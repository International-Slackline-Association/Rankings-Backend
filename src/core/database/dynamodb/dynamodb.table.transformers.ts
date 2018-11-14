import { DDBRepository } from './dynamodb.repo';
import { IAWSServices } from 'core/aws/aws.services.interface';

export type AttrsTransformer<T> = { [P in keyof T]: ((...params: string[]) => string) };
export type AttrsTransformerOptional<T> = { [P in keyof T]?: ((...params: any[]) => any) };
export type ItemTransformerOptional<T> = { [P in keyof T]?: ((...params: any[]) => any) };

export abstract class DDBOverloadedTableTransformers<TAllAttrs, TTransformedItem> {

    protected abstract attrsToItemTransformer: ItemTransformerOptional<TTransformedItem>;
    protected abstract itemToAttrsTransformer: AttrsTransformerOptional<TAllAttrs>;

    protected abstract transformAttrsToItem(dynamodbItem: TAllAttrs): TTransformedItem;

    protected abstract transformItemToAttrs(item: TTransformedItem): TAllAttrs;

    protected attrNameTyped<T>(attr: keyof T): string {
        return this.identity(attr);
    }

    protected attrName(attr: keyof TAllAttrs): string {
        return this.identity(attr);
    }

    protected identity(x) {
        return x;
    }
}
