import { AgeCategory, Discipline, Gender } from 'shared/enums';
import { DDBOverloadedTableTransformer } from '../../../dynamodb.table.transformers';
import { buildCompositeKey, destructCompositeKey } from '../../../utils/utils';
import { AllAttrs, DDBAthleteRankingsItem } from '../athlete.rankings.interface';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class AttrsTransformer extends DDBOverloadedTableTransformer<
  AllAttrs,
  DDBAthleteRankingsItem
> {
  constructor() {
    super();
  }

  public prefixes = {
    PK: 'Athlete',
    SK_GSI: 'Rankings',
  };

  public attrsToItemTransformer = {
    athleteId: (pk: string) => destructCompositeKey(pk, 1),
    year: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    discipline: (sk_gsi: string) =>
      parseInt(destructCompositeKey(sk_gsi, 2), 10),
    gender: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 3), 10),
    ageCategory: (sk_gsi: string) =>
      parseInt(destructCompositeKey(sk_gsi, 4), 10),
    points: (gsi_sk: string) => parseFloat(gsi_sk),
  };

  public itemToAttrsTransformer = {
    PK: (id: string) => buildCompositeKey(this.prefixes.PK, id),
    SK_GSI: (
      year: number,
      discipline: Discipline,
      gender: Gender,
      ageCategory: AgeCategory,
    ) =>
      buildCompositeKey(
        this.prefixes.SK_GSI,
        year && year.toString(),
        discipline !== undefined && discipline.toString(),
        gender !== undefined && gender.toString(),
        ageCategory !== undefined && ageCategory.toString(),
      ),
    LSI: () => undefined,
    GSI_SK: (points: number) => points.toString(),
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBAthleteRankingsItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      athleteId: this.attrsToItemTransformer.athleteId(PK),
      discipline: this.attrsToItemTransformer.discipline(SK_GSI),
      gender: this.attrsToItemTransformer.gender(SK_GSI),
      ageCategory: this.attrsToItemTransformer.ageCategory(SK_GSI),
      year: this.attrsToItemTransformer.year(SK_GSI),
      points: this.attrsToItemTransformer.points(GSI_SK),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBAthleteRankingsItem): AllAttrs {
    const {
      athleteId,
      year,
      points,
      discipline,
      gender,
      ageCategory,
      ...rest
    } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(athleteId),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(
        year,
        discipline,
        gender,
        ageCategory,
      ),
      LSI: this.itemToAttrsTransformer.LSI(),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(points),
      ...rest,
    };
  }

  public primaryKey(
    athleteId: string,
    year: number,
    discipline: Discipline,
    gender: Gender,
    ageCategory: AgeCategory,
  ) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(athleteId),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(
        year,
        discipline,
        gender,
        ageCategory,
      ),
    };
  }
}
