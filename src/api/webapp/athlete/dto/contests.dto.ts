import * as Joi from 'joi';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class AthleteContestsDto {
  public readonly id: string;
  public readonly selectedCategories?: number[];
  public readonly next?: {
    contestId: string;
    discipline: Discipline;
    date: string;
  };
}

export const athleteContestsDtoSchema = Joi.object().keys({
  id: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown id')),
  selectedCategories: Joi.array()
    .allow(null)
    .length(2)
    .required()
    .items(
      Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown category value')),
    ),
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
    .and('athleteId', 'points'),
});
