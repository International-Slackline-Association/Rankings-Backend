import * as moment from 'moment';
import latinize = require('latinize');

export function unixToDate(unix: number): moment.Moment {
  return moment.unix(unix);
}

export function normalizeStringForSearching(str: string) {
  return (latinize(str) as string).toLowerCase();
}

export function csvToObject<T = any>(csvString: string) {
  const nestedDelimeter = '__';
  const csv = csvString.split('\n');

  const attrs = csv.splice(0, 1)[0];

  const result = csv.map(row => {
    let obj = {};
    const rowData = row.split(',');
    attrs.split(',').forEach((attr, idx) => {
      obj = constructObj(attr, obj, rowData[idx]);
    });
    return obj;
  });

  return result;

  function constructObj(attr, parentObj, data) {
    if (attr.split(nestedDelimeter).length === 1) {
      parentObj[attr] = data;
      return parentObj;
    }

    const curKey = attr.split(nestedDelimeter)[0];
    if (!parentObj[curKey]) parentObj[curKey] = {};
    parentObj[curKey] = constructObj(
      attr
        .split(nestedDelimeter)
        .slice(1)
        .join(nestedDelimeter),
      parentObj[curKey],
      data,
    );
    return parentObj;
  }
}
