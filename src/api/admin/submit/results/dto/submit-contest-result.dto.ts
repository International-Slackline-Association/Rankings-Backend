import * as Joi from 'joi';
import { CompetitionDisciplines, Discipline } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export interface ContestResult {
  readonly contestId: string;
  readonly discipline: number;
  readonly places: { athleteId: string; place: number }[];
}

export class SubmitContestResultDto implements ContestResult {
  public readonly places: { athleteId: string; place: number }[];
  public readonly contestId: string;
  public readonly discipline: Discipline;
}

export const submitContestResultDtoSchema = Joi.object().keys({
  contestId: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown contestId')),
  discipline: Joi.number()
    .required()
    .valid(CompetitionDisciplines)
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
        })
        .required(),
    )
    .error(new APIErrors.JoiValidationError('Invalid Results')),
});
