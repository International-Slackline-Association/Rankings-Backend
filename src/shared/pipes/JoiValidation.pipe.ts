import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema) {}

  public transform(v: any, metadata: ArgumentMetadata) {
    const { error, value } = Joi.validate(v, this.schema, { convert: true });
    if (error) {
      throw error;
    }
    return value;
  }
}
