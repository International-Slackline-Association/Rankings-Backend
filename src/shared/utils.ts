import * as moment from 'moment';

import latinize = require('latinize');

// tslint:disable-next-line:no-namespace
export namespace Utils {
  export function concatParams(base: string, ...params: string[]) {
    let str = base;
    for (const param of params) {
      if (param !== undefined && param !== null && param.length > 0) {
        str = str + ':' + param;
      } else {
        break;
      }
    }
    return str;
  }

  export function unixToDate(unix: number): moment.Moment {
    return moment.unix(unix);
  }

  export function normalizeStringForSearching(str: string) {
    return (latinize(str) as string).toLowerCase();
  }

  export function omitReject<T>(promise: Promise<T>) {
    return promise.then<T>(d => d).catch<null>(_ => null);
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
      if (!parentObj[curKey]) { parentObj[curKey] = {}; }
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
}
