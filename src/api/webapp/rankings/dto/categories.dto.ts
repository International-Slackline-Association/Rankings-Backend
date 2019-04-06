import * as Joi from 'joi';

import { APIErrors } from 'shared/exceptions/api.exceptions';

export class CategoriesDto {
  public readonly selectedCategories?: number[];
}

export const rankingsListDtoSchema = Joi.object().keys({
  selectedCategories: Joi.array()
    .length(5)
    .allow(null)
    .optional()
    .items(
      Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown category value')),
    )
    .error(new APIErrors.JoiValidationError('Invalid categories')),
});
