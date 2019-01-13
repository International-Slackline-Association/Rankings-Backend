import * as Joi from 'joi';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class ContestSuggestionsDto {
  public readonly query: string;
  public readonly year?: number;
  public readonly discipline?: Discipline;
}

export const contestSuggestionsDtoSchema = Joi.object().keys({
  query: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown query')),
  year: Joi.number()
    .optional()
    .allow(null),
  discipline: Joi.number()
    .optional()
    .allow(null)
    .valid([Discipline.Overall, ...DisciplineUtility.CompetitionDisciplines])
    .error(new APIErrors.JoiValidationError('Invalid discipline')),
});
