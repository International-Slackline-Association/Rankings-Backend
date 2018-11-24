import { Injectable } from '@nestjs/common';
import {
  buildCompositeKey,
  destructCompositeKey,
} from '../../../../utils/utils';
import { Discipline } from 'shared/enums';
import { DDBOverloadedTableTransformer } from 'core/database/dynamodb/dynamodb.table.transformers';
import {
  AllAttrs,
  DDBAthleteContestItem,
} from '../../athlete.contests.interface';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
@Injectable()
export class DefaultAttrsTransformer extends DDBOverloadedTableTransformer<
  AllAttrs,
  DDBAthleteContestItem
> {
  constructor() {
    super();
  }
  public prefixes = {
    PK: 'Athlete',
    SK_GSI: 'Contest',
    LSI: 'Contest',
  };

  public attrsToItemTransformer = {
    athleteId: (pk: string) => destructCompositeKey(pk, 1),
    contestId: (sk_gsi: string) => destructCompositeKey(sk_gsi, 3),
    year: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    discipline: (sk_gsi: string) =>
      parseInt(destructCompositeKey(sk_gsi, 2), 10),
    date: (lsi: string) => parseInt(destructCompositeKey(lsi, 3), 10),
    points: (gsi_sk: string) => parseFloat(gsi_sk),
  };

  public itemToAttrsTransformer = {
    PK: (id: string) => buildCompositeKey(this.prefixes.PK, id),
    SK_GSI: (year: number, discipline: Discipline, contestId: string) =>
      buildCompositeKey(
        this.prefixes.SK_GSI,
        year && year.toString(),
        discipline !== undefined && discipline.toString(),
        contestId,
      ),
    LSI: (year: number, discipline: Discipline, date: number) =>
      buildCompositeKey(
        this.prefixes.LSI,
        year && year.toString(),
        discipline !== undefined && discipline.toString(),
        date && date.toString(),
      ),
    GSI_SK: (points: number) => points.toString(),
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
      LSI: this.itemToAttrsTransformer.LSI(year, discipline, date),
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
