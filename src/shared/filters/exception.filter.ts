import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import env_variables from 'shared/env_variables';
import { APIError, APIErrorAlias } from 'shared/exceptions/api.error';
import { logger } from 'shared/logger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let apiError = exception;

    if (exception instanceof APIError) {
      logger.debug('Expected API Exception', { data: exception });
    } else if (exception instanceof HttpException) {
      logger.warn('Unexpected HttpException', { data: exception });
      apiError = this.transformHttpExceptionToAPIError(exception);
    } else {
      logger.error('Exception', { data: { message: exception.message, stack: exception.stack } });
      apiError = this.transformToAPIError(exception);
    }

    const status = apiError.getStatus();
    const rsp = {
      alias: apiError.alias,
      code: apiError.status,
      message: apiError.message,
      stack: apiError.stack,
      data: apiError.data,
    };
    response.status(status).json(rsp);
  }

  private transformHttpExceptionToAPIError(exception: HttpException): APIError {
    let errMessage = env_variables.isProd ? 'Unknow error' : exception.message;

    if (errMessage.message) {
      errMessage = errMessage.message;
    }

    const convertedError = new APIError({
      alias: APIErrorAlias.Unknown,
      message: errMessage,
      stack: exception.stack,
      status: exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR,
      // data: exception.data,
    });
    return convertedError;
  }

  private transformToAPIError(exception: any): APIError {
    const convertedError = new APIError({
      alias: APIErrorAlias.Unknown,
      message: exception.message,
      stack: exception.stack,
      status: exception.status || HttpStatus.INTERNAL_SERVER_ERROR,
      data: exception.data,
    });
    return convertedError;
  }
}
