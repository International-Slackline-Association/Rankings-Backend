import { Injectable } from '@nestjs/common';
import { DDBOverloadedTableTransformers } from '../../../dynamodb.table.transformers';
import { AllAttrs, DDBAthleteDetailItem } from '../athlete.details.interface';
import { destructCompositeKey, buildCompositeKey } from '../../../utils/utils';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
@Injectable()
export class DDBAthleteDetailsAttrsTransformers extends DDBOverloadedTableTransformers<
  AllAttrs,
  DDBAthleteDetailItem
> {
  constructor() {
    super();
  }

  protected attrsToItemTransformer = {
    athleteId: (pk: string) => destructCompositeKey(pk, 1),
    name: (gsi_sk: string) => gsi_sk,
  };

  protected itemToAttrsTransformer = {
    PK: (id: string) => buildCompositeKey('Athlete', id),
    SK_GSI: () => 'AthleteDetails',
    LSI: () => undefined,
    GSI_SK: (name: string) => name,
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBAthleteDetailItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      athleteId: this.attrsToItemTransformer.athleteId(PK),
      name: this.attrsToItemTransformer.name(GSI_SK),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBAthleteDetailItem): AllAttrs {
    const { athleteId, name, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(item.athleteId),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(),
      LSI: this.itemToAttrsTransformer.LSI(),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(name),
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
