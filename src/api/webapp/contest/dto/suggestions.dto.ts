import * as Joi from 'joi';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class ContestSuggestionsDto {
  public readonly query: string;
  public readonly selectedCategories?: number[];
}

export const contestSuggestionsDtoSchema = Joi.object().keys({
  query: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown query')),
  selectedCategories: Joi.array()
    .length(2)
    .allow(null)
    .optional()
    .items(
      Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown category value')),
    )
    .error(new APIErrors.JoiValidationError('Invalid categories')),

});
