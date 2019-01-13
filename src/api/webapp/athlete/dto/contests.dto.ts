import * as Joi from 'joi';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class AthleteContestsDto {
  public readonly id: string;
  public readonly discipline: Discipline;
  public readonly year: number;
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
  discipline: Joi.number()
    .required()
    .valid([...DisciplineUtility.CategoricalDisciplines, ...DisciplineUtility.CompetitionDisciplines])
    .error(new APIErrors.JoiValidationError('Invalid discipline')),
  year: Joi.number()
    .required()
    .error(new APIErrors.JoiValidationError('Invalid year')),
  next: Joi.object()
    .allow(null)
    .keys({
      contestId: Joi.string()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown contestId')),
      date: Joi.string()
        .isoDate()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown date')),
      discipline: Joi.number()
        .required()
        .valid([...DisciplineUtility.CategoricalDisciplines, ...DisciplineUtility.CompetitionDisciplines])
        .error(new APIErrors.JoiValidationError('Invalid discipline')),
    })
    .and('athleteId', 'points'),
});
