export interface DDBTableKeyAttrs {
    readonly PK: string;
    readonly SK_GSI: string;
    readonly LSI: string;
    readonly GSI_SK: string;
}