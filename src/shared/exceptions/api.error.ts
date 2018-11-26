import { HttpException, HttpStatus } from '@nestjs/common';
import env_variables from 'shared/env_variables';

export enum APIErrorAlias {
  Unknown = 'Unknown',
  ValidationError = 'ValidationError',
  NotFound = 'NotFound',
}

export interface IAPIError {
  alias?: APIErrorAlias;
  message: string;
  data?: any;
}

export class APIError extends HttpException implements IAPIError {
  public alias?: APIErrorAlias;
  public message: string;
  public stack?: string;
  public data?: any;

  constructor(params: {
    message: string;
    alias?: APIErrorAlias;
    status?: number;
    stack?: string;
    data?: any;
  }) {
    if (env_variables.isProd) {
      delete params.stack;
    }
    super(params, params.status || HttpStatus.INTERNAL_SERVER_ERROR);

    this.alias = params.alias;
    this.message = params.message;
    this.stack = params.stack;
    this.data = params.data;

    if (!env_variables.isProd && !params.stack) {
      (Object as any).setPrototypeOf(this, APIError.prototype);
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
