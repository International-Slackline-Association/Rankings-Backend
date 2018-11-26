import { DDBOverloadedTableTransformer } from 'core/database/dynamodb/dynamodb.table.transformers';
import { Discipline } from 'shared/enums';
import { buildCompositeKey, destructCompositeKey } from '../../../utils/utils';
import { AllAttrs, DDBDisciplineContestItem } from '../../discipline.contest.interface';
import { DefaultAttrsTransformer } from './default-transformer';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class ByDateAttrsTransformer extends DDBOverloadedTableTransformer<
  AllAttrs,
  DDBDisciplineContestItem
> {
  constructor(private readonly base: DefaultAttrsTransformer) {
    super();
  }

  public prefixes = {
    PK: 'Contests',
    SK_GSI: 'ContestByDate',
    LSI: 'ContestByDate',
  };

  public attrsToItemTransformer = {
    contestId: this.base.attrsToItemTransformer.contestId,
    year: this.base.attrsToItemTransformer.year,
    discipline: this.base.attrsToItemTransformer.discipline,
    date: (lsi: string) => parseInt(destructCompositeKey(lsi, 2), 10),
  };

  public itemToAttrsTransformer = {
    PK: this.base.itemToAttrsTransformer.PK,
    SK_GSI: (year: number, discipline: Discipline, contestId: string) =>
      buildCompositeKey(
        this.prefixes.SK_GSI,
        year && year.toString(),
        discipline !== undefined && discipline.toString(),
        contestId,
      ),
    LSI: (year: number, date: number) =>
      buildCompositeKey(
        this.prefixes.LSI,
        year && year.toString(),
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
      LSI: this.itemToAttrsTransformer.LSI(year, date),
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
