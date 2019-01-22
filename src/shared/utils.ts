import latinize = require('latinize');
import { isNil as _isNil } from 'lodash';
import * as moment from 'moment';

import { Constants } from './constants';
import env_variables from './env_variables';
import { logger } from './logger';

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

  export function dateToMoment(date: Date): moment.Moment {
    return moment(date);
  }

  export function normalizeString(str: string) {
    if (!str) {
      return str;
    }
    return latinize(str).toLowerCase();
  }

  export async function omitReject<T>(promise: Promise<T>) {
    return promise.then<T>(d => d).catch<null>(err => {
      logger.debug('OmitReject Error', { err: JSON.stringify(err) });
      return null;
    });
  }

  export function isRequestAuthenticated(request: Express.Request) {
    if (env_variables.isDev) {
      return true;
    }
    return isNil(request.cognitoClaims);
  }

  export function isNil(value: any) {
    return _isNil(value);
  }

  export function logThrowError(errorDesc: string, params: any) {
    return err => {
      logError(errorDesc, err, params);
      throw err;
    };
  }

  export function logError(errorDesc: string, err: any, params: any) {
    let errMessage;
    if (!err.requestId) {
      // Not AWSError
      errMessage = err.message;
    }
    logger.error(`Error: ${errorDesc}`, {
      data: {
        params: params,
        error: errMessage || err,
      },
    });
  }
}
