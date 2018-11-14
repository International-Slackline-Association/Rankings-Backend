import { Injectable } from '@nestjs/common';
import { DDBOverloadedTableTransformers } from '../dynamodb.table.transformers';
import { AllAttrs, DDBAthleteDetailItem } from './athlete.details.interface';

@Injectable()
export class DDBAthleteDetailsRepositoryTransformers extends DDBOverloadedTableTransformers<
    AllAttrs,
    DDBAthleteDetailItem
> {
    constructor() {
        super();
    }

    protected attrsToItemTransformer = {
        AthleteId: (pk: string) => pk.split(':')[1],
    };

    protected itemToAttrsTransformer = {
        PK: (id: string) => `Athlete:${id}`,
        SK_GSI: () => 'Details',
        LSI: () => undefined,
        GSI_SK: () => undefined,
    };

    public transformAttrsToItem(
        dynamodbItem: AllAttrs,
    ): DDBAthleteDetailItem {
        const { PK, SK_GSI, LSI, GSI_SK, ...rest } = dynamodbItem;
        return {
            AthleteId: this.attrsToItemTransformer.AthleteId(PK),
            ...rest,
        };
    }

    public transformItemToAttrs(item: DDBAthleteDetailItem): AllAttrs {
        const { AthleteId, ...rest } = item;
        return {
            PK: this.itemToAttrsTransformer.PK(item.AthleteId),
            SK_GSI: this.itemToAttrsTransformer.SK_GSI(),
            LSI: this.itemToAttrsTransformer.LSI(),
            GSI_SK: this.itemToAttrsTransformer.GSI_SK(),
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
