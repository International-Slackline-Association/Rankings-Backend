import { Injectable } from '@nestjs/common';
import { DDBOverloadedTableTransformer } from 'core/database/dynamodb/dynamodb.table.transformers';
import { Discipline } from 'shared/enums';
import { Utils } from 'shared/utils';
import { buildCompositeKey, destructCompositeKey } from '../../../utils/utils';
import { AllAttrs, DDBAthleteContestItem, KeyAttrs } from '../athlete.contests.interface';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
@Injectable()
export class AttrsTransformer extends DDBOverloadedTableTransformer<AllAttrs, DDBAthleteContestItem> {
  constructor() {
    super();
  }
  public prefixes: KeyAttrs = {
    PK: 'Athlete',
    SK_GSI: 'Contest',
    LSI: 'Contest',
    GSI_SK: '',
  };

  public attrsToItemTransformer = {
    athleteId: (pk: string) => destructCompositeKey(pk, 1),
    contestId: (sk_gsi: string) => destructCompositeKey(sk_gsi, 2),
    discipline: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    date: (lsi: string) => destructCompositeKey(lsi, 1),
    points: (gsi_sk: string) => parseFloat(gsi_sk),
  };

  public itemToAttrsTransformer = {
    PK: (id: string) => buildCompositeKey(this.prefixes.PK, id),
    SK_GSI: (discipline: Discipline, contestId: string) =>
      buildCompositeKey(this.prefixes.SK_GSI, !Utils.isNil(discipline) && discipline.toString(), contestId),
    LSI: (date: string) => buildCompositeKey(this.prefixes.LSI, date),
    GSI_SK: (points: number) => points.toString(),
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBAthleteContestItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      athleteId: this.attrsToItemTransformer.athleteId(PK),
      contestId: this.attrsToItemTransformer.contestId(SK_GSI),
      discipline: this.attrsToItemTransformer.discipline(SK_GSI),
      date: this.attrsToItemTransformer.date(LSI),
      points: this.attrsToItemTransformer.points(GSI_SK),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBAthleteContestItem): AllAttrs {
    const { athleteId, contestId, date, points, discipline, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(athleteId),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(discipline, contestId),
      LSI: this.itemToAttrsTransformer.LSI(date),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(points),
      ...rest,
    };
  }

  public primaryKey(athleteId: string, discipline: Discipline, contestId: string) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(athleteId),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(discipline, contestId),
    };
  }
}
