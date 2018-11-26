import { DynamoDBStreams } from 'aws-sdk';
import { DDBTableKeyAttrs } from 'core/database/dynamodb/interfaces/table.interface';
import { destructCompositeKey } from 'core/database/dynamodb/utils/utils';

export const isRecordOfTypeOfKeys = (
  keys: DynamoDBStreams.AttributeMap,
  keyAttrsPrefixes: DDBTableKeyAttrs,
) => {
  for (const key of Object.keys(keys)) {
    const value = keys[key].S as string;
    if (!value) {
      return false;
    }

    const comparaValue = keyAttrsPrefixes[key] as string;

    if (comparaValue === null || comparaValue.length === 0) {
      continue;
    }
    const prefix = destructCompositeKey(value, 0);
    if (comparaValue != null) {
      if (prefix !== comparaValue) {
        return false;
      }
      continue;
    }

    return false;
  }

  return true;
};
