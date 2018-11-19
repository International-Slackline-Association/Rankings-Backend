import { Injectable } from '@nestjs/common';
import { DDBOverloadedTableTransformers } from '../../dynamodb.table.transformers';
import { AllAttrs, DDBContestItem } from '../contests.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { buildCompositeKey, destructCompositeKey } from '../../utils/utils';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
@Injectable()
export class DDBContestsAttrsTransformers extends DDBOverloadedTableTransformers<
  AllAttrs,
  DDBContestItem
> {
  constructor() {
    super();
  }

  public attrsToItemTransformer = {
    contestId: (sk_gsi: string) => destructCompositeKey(sk_gsi, 2),
    year: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    date: (lsi: string) => parseInt(destructCompositeKey(lsi, 2), 10),
  };

  public itemToAttrsTransformer = {
    PK: () => `Contests`,
    SK_GSI: (year: number, contestId: string) =>
      buildCompositeKey('Contest', year && year.toString(), contestId),
    LSI: (year: number, date: number) =>
      buildCompositeKey(
        'Contest',
        year && year.toString(),
        date && date.toString(),
      ),
    GSI_SK: () => undefined,
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBContestItem {
    const {
      PK,
      SK_GSI,
      LSI,
      GSI_SK,
      disciplines,
      categories,
      ...rest
    } = dynamodbItem;
    return {
      contestId: this.attrsToItemTransformer.contestId(SK_GSI),
      disciplines: disciplines.values as number[],
      categories: disciplines.values as number[],
      year: this.attrsToItemTransformer.year(SK_GSI),
      date: this.attrsToItemTransformer.date(LSI),
      ...rest,
    };
  }

  public transformItemToAttrs(
    item: DDBContestItem,
    client: DocumentClient,
  ): AllAttrs {
    const { contestId, disciplines, categories, year, date, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(year, contestId),
      LSI: this.itemToAttrsTransformer.LSI(year, date),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(),
      disciplines: client.createSet(disciplines),
      categories: client.createSet(categories),
      ...rest,
    };
  }

  public primaryKey(contestId: string, year: number) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(
        year,
        contestId,
      ),
    };
  }
}
