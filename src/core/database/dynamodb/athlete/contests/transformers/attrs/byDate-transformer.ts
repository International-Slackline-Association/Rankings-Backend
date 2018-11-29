import { DDBOverloadedTableTransformer } from 'core/database/dynamodb/dynamodb.table.transformers';
import { isNil } from 'lodash';
import { Discipline } from 'shared/enums';
import { buildCompositeKey, destructCompositeKey } from '../../../../utils/utils';
import { AllAttrs, DDBAthleteContestItem } from '../../athlete.contests.interface';
import { DefaultAttrsTransformer } from './default-transformer';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class ByDateAttrsTransformer extends DDBOverloadedTableTransformer<
  AllAttrs,
  DDBAthleteContestItem
> {
  constructor(private readonly base: DefaultAttrsTransformer) {
    super();
  }

  public prefixes = {
    PK: 'Athlete',
    SK_GSI: 'ContestByDate',
    LSI: 'ContestByDate',
  };

  public attrsToItemTransformer = {
    athleteId: this.base.attrsToItemTransformer.athleteId,
    contestId: this.base.attrsToItemTransformer.contestId,
    year: this.base.attrsToItemTransformer.year,
    discipline: this.base.attrsToItemTransformer.discipline,
    date: (lsi: string) => parseInt(destructCompositeKey(lsi, 2), 10),
    points: this.base.attrsToItemTransformer.points,
  };

  public itemToAttrsTransformer = {
    PK: this.base.itemToAttrsTransformer.PK,
    SK_GSI: (year: number, discipline: Discipline, contestId: string) =>
      buildCompositeKey(
        this.prefixes.SK_GSI,
        year && year.toString(),
        !isNil(discipline) && discipline.toString(),
        contestId,
      ),
    LSI: (year: number, date: number) =>
      buildCompositeKey(
        this.prefixes.LSI,
        year && year.toString(),
        date && date.toString(),
      ),
    GSI_SK: this.base.itemToAttrsTransformer.GSI_SK,
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBAthleteContestItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      athleteId: this.attrsToItemTransformer.athleteId(PK),
      contestId: this.attrsToItemTransformer.contestId(SK_GSI),
      discipline: this.attrsToItemTransformer.discipline(SK_GSI),
      year: this.attrsToItemTransformer.year(SK_GSI),
      date: this.attrsToItemTransformer.date(LSI),
      points: this.attrsToItemTransformer.points(GSI_SK),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBAthleteContestItem): AllAttrs {
    const {
      athleteId,
      contestId,
      year,
      date,
      points,
      discipline,
      ...rest
    } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(athleteId),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(year, discipline, contestId),
      LSI: this.itemToAttrsTransformer.LSI(year, date),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(points),
      ...rest,
    };
  }
  public primaryKey(
    athleteId: string,
    year: number,
    discipline: Discipline,
    contestId: string,
  ) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(athleteId),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(
        year,
        discipline,
        contestId,
      ),
    };
  }
}
