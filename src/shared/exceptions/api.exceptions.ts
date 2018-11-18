import { HttpStatus } from '@nestjs/common';
import { APIError, APIErrorAlias } from './api.error';

export function joiError(message) {
  return new JoiValidationError(message);
}

// tslint:disable-next-line:max-classes-per-file
export class JoiValidationError extends APIError {
  constructor(message?: string) {
    super({
      message: message || 'Validation Error',
      alias: APIErrorAlias.ValidationError,
      status: HttpStatus.BAD_REQUEST,
    });
  }
}
