import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema) {}

  public transform(value: any, metadata: ArgumentMetadata) {
    const { error } = Joi.validate(value, this.schema, { convert: true });
    if (error) {
      throw error;
    }
    return value;
  }
}
