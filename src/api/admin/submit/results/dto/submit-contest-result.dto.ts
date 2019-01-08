import * as Joi from 'joi';
import { CompetitionDisciplines, Discipline } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export interface ContestResult {
  readonly contestId: string;
  readonly discipline: number;
  readonly places: { athleteId: string }[];
}

export class SubmitContestResultDto implements ContestResult {
  public readonly places: { athleteId: string }[];
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
        })
        .required(),
    )
    .error(new APIErrors.JoiValidationError('Results must be greater than 1')),
});
