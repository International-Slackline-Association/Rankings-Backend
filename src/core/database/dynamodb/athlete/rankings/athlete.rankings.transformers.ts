import { Injectable } from '@nestjs/common';
import { DDBOverloadedTableTransformers } from '../../dynamodb.table.transformers';
import { AllAttrs, DDBAthleteRankingsItem } from './athlete.rankings.interface';
import { buildCompositeKey, destructCompositeKey } from '../../utils/utils';
import { Discipline } from 'shared/enums';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
@Injectable()
export class DDBAthleteRankingsAttrsTransformers extends DDBOverloadedTableTransformers<
  AllAttrs,
  DDBAthleteRankingsItem
> {
  constructor() {
    super();
  }

  public attrsToItemTransformer = {
    athleteId: (pk: string) => destructCompositeKey(pk, 1),
    year: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    discipline: (sk_gsi: string) =>
      parseInt(destructCompositeKey(sk_gsi, 2), 10),
    points: (gsi_sk: string) => parseFloat(gsi_sk),
  };

  public itemToAttrsTransformer = {
    PK: (id: string) => buildCompositeKey('Athlete', id),
    SK_GSI: (year: number, discipline: Discipline) =>
      buildCompositeKey(
        'Rankings',
        discipline && discipline.toString(),
        year && year.toString(),
      ),
    LSI: () => undefined,
    GSI_SK: (points: number) => points.toString(),
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBAthleteRankingsItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      athleteId: this.attrsToItemTransformer.athleteId(PK),
      discipline: this.attrsToItemTransformer.discipline(SK_GSI),
      year: this.attrsToItemTransformer.year(SK_GSI),
      points: this.attrsToItemTransformer.points(GSI_SK),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBAthleteRankingsItem): AllAttrs {
    const { athleteId, year, points, discipline, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(athleteId),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(year, discipline),
      LSI: this.itemToAttrsTransformer.LSI(),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(points),
      ...rest,
    };
  }

  public primaryKey(
    athleteId: string,
    year: number,
    discipline: Discipline,
  ) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(athleteId),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(
        year,
        discipline,
      ),
    };
  }
}
