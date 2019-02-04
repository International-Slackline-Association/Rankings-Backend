import * as Joi from 'joi';
import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export interface ContestResult {
  readonly contestId: string;
  readonly discipline: number;
  readonly places: { athleteId: string; place: number; points?: number }[];
}

export class SubmitContestResultDto implements ContestResult {
  public readonly places: { athleteId: string; place: number; points?: number }[];
  public readonly contestId: string;
  public readonly discipline: Discipline;
}

export const submitContestResultDtoSchema = Joi.object().keys({
  contestId: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown contestId')),
  discipline: Joi.number()
    .required()
    .valid(DisciplineUtility.CompetitionDisciplines)
    .error(new APIErrors.JoiValidationError('Invalid discipline')),
  places: Joi.array()
    .min(2)
    .required()
    .items(
      Joi.object()
        .keys({
          athleteId: Joi.string()
            .required()
            .error(new APIErrors.JoiValidationError('Unknown athleteId')),
          place: Joi.number()
            .required()
            .error(new APIErrors.JoiValidationError('Unknown place')),
          points: Joi.number()
            .optional()
            .allow(null, '')
            .error(new APIErrors.JoiValidationError('Unknown points')),
        })
        .required(),
    )
    .error(new APIErrors.JoiValidationError('Invalid Results')),
});
