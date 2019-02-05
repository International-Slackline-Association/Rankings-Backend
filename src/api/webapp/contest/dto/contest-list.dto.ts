import * as Joi from 'joi';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class ContestListDto {
  public readonly selectedCategories?: number[];
  public readonly contestId: string;
  public readonly next?: {
    contestId: string;
    discipline: Discipline;
    date: string;
  };
}

export const contestListDtoSchema = Joi.object().keys({
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
  contestId: Joi.string()
    .allow(null, '')
    .error(new APIErrors.JoiValidationError('Invalid contestId')),
  next: Joi.object()
    .allow(null)
    .keys({
      contestId: Joi.string()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown contestId')),
      date: Joi.string()
        // .isoDate()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown date')),
      discipline: Joi.number()
        .required()
        .valid([...DisciplineUtility.CategoricalDisciplines, ...DisciplineUtility.CompetitionDisciplines])
        .error(new APIErrors.JoiValidationError('Invalid discipline')),
    })
    .and('contestId', 'date', 'discipline'),
});
