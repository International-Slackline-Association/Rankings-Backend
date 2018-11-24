import { DDBOverloadedTableTransformer } from '../../../dynamodb.table.transformers';
import { AllAttrs, DDBAthleteDetailItem } from '../athlete.details.interface';
import { destructCompositeKey, buildCompositeKey } from '../../../utils/utils';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class AttrsTransformer extends DDBOverloadedTableTransformer<
  AllAttrs,
  DDBAthleteDetailItem
> {
  constructor() {
    super();
  }

  public prefixes = {
    PK: 'Athlete',
    SK_GSI: 'AthleteDetails',
  };

  protected attrsToItemTransformer = {
    athleteId: (pk: string) => destructCompositeKey(pk, 1),
  };

  protected itemToAttrsTransformer = {
    PK: (id: string) => buildCompositeKey(this.prefixes.PK, id),
    SK_GSI: () => this.prefixes.SK_GSI,
    LSI: () => undefined,
    GSI_SK: (name: string) => name,
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBAthleteDetailItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      athleteId: this.attrsToItemTransformer.athleteId(PK),
      normalizedName: GSI_SK,
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBAthleteDetailItem): AllAttrs {
    const { athleteId, normalizedName, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(item.athleteId),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(),
      LSI: this.itemToAttrsTransformer.LSI(),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(normalizedName),
      ...rest,
    };
  }

  public primaryKey(athleteId: string) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(athleteId),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(),
    };
  }
}
