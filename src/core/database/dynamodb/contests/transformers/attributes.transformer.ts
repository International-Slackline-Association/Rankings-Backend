import { Discipline } from 'shared/enums';
import { Utils } from 'shared/utils';
import { DDBOverloadedTableTransformer } from '../../dynamodb.table.transformers';
import { buildCompositeKey, destructCompositeKey } from '../../utils/utils';
import { AllAttrs, DDBContestItem } from '../contest.interface';

/**
 * Transformers define how the application level DTO objects transforms to DynamoDB attributes in a table
 */
export class AttrsTransformer extends DDBOverloadedTableTransformer<AllAttrs, DDBContestItem> {
  constructor() {
    super();
  }

  public prefixes = {
    PK: 'Contests',
    SK_GSI: 'Contest',
    LSI: 'Contest',
    GSI_SK: '',
  };

  public attrsToItemTransformer = {
    contestId: (sk_gsi: string) => destructCompositeKey(sk_gsi, 2),
    discipline: (sk_gsi: string) => parseInt(destructCompositeKey(sk_gsi, 1), 10),
    date: (lsi: string) => destructCompositeKey(lsi, 1),
  };

  public itemToAttrsTransformer = {
    PK: () => this.prefixes.PK,
    SK_GSI: (discipline: Discipline, contestId: string) =>
      buildCompositeKey(
        this.prefixes.SK_GSI,
        !Utils.isNil(discipline) && discipline.toString(),
        contestId,
      ),
    LSI: (date: string) =>
      buildCompositeKey(
        this.prefixes.LSI,
        date,
      ),
    GSI_SK: () => undefined,
  };

  public transformAttrsToItem(dynamodbItem: AllAttrs): DDBContestItem {
    const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
    return {
      contestId: this.attrsToItemTransformer.contestId(SK_GSI),
      discipline: this.attrsToItemTransformer.discipline(SK_GSI),
      date: this.attrsToItemTransformer.date(LSI),
      ...rest,
    };
  }

  public transformItemToAttrs(item: DDBContestItem): AllAttrs {
    const { contestId, discipline, date, ...rest } = item;
    return {
      PK: this.itemToAttrsTransformer.PK(),
      SK_GSI: this.itemToAttrsTransformer.SK_GSI(discipline, contestId),
      LSI: this.itemToAttrsTransformer.LSI(date),
      GSI_SK: this.itemToAttrsTransformer.GSI_SK(),
      ...rest,
    };
  }

  public primaryKey(discipline: Discipline, contestId: string) {
    return {
      [this.attrName('PK')]: this.itemToAttrsTransformer.PK(),
      [this.attrName('SK_GSI')]: this.itemToAttrsTransformer.SK_GSI(discipline, contestId),
    };
  }
}
