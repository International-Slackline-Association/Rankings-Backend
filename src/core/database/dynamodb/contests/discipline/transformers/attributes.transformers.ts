import { Injectable } from '@nestjs/common';
import { DDBOverloadedTableTransformers } from '../../../dynamodb.table.transformers';
import {
  AllAttrs,
  DDBDisciplineContestItem,
} from '../discipline.contest.interface';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { buildCompositeKey, destructCompositeKey } from '../../../utils/utils';
import { Discipline } from 'shared/enums';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
@Injectable()
export class DDBDisciplineContestAttrsTransformers extends DDBOverloadedTableTransformers<
  AllAttrs,
  DDBDisciplineContestItem
> {
  constructor() {
    super();
  }

  public attrsToItemTransformer = {
    contestId: (sk_gsi: string) => destructCompositeKey(sk_gsi, 3),
    year: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    discipline: (sk_gsi: string) =>
      parseInt(destructCompositeKey(sk_gsi, 2), 10),
    date: (lsi: string) => parseInt(destructCompositeKey(lsi, 3), 10),
  };

  public itemToAttrsTransformer = {
    PK: () => `Contests`,
    SK_GSI: (year: number, discipline: Discipline, contestId: string) =>
      buildCompositeKey(
        'Contest',
        year && year.toString(),
        discipline !== undefined && discipline.toString(),
        contestId,
      ),
    LSI: (year: number, discipline: Discipline, date: number) =>
      buildCompositeKey(
        'Contest',
        year && year.toString(),
        discipline !== undefined && discipline.toString(),
        date && date.toString(),
      ),
    GSI_SK: () => undefined,
  };

  public transformAttrsToItem(
    dynamodbItem: AllAttrs,
  ): DDBDisciplineContestItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      contestId: this.attrsToItemTransformer.contestId(SK_GSI),
      discipline: this.attrsToItemTransformer.discipline(SK_GSI),
      year: this.attrsToItemTransformer.year(SK_GSI),
      date: this.attrsToItemTransformer.date(LSI),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBDisciplineContestItem): AllAttrs {
    const { contestId, discipline, year, date, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(year, discipline, contestId),
      LSI: this.itemToAttrsTransformer.LSI(year, discipline, date),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(),
      ...rest,
    };
  }

  public primaryKey(year: number, discipline: Discipline, contestId: string) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(
        year,
        discipline,
        contestId,
      ),
    };
  }
}
