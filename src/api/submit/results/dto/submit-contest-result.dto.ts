import * as Joi from 'joi';
import { CompetitionDisciplines, Discipline } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export interface DisciplineResultGroup {
  discipline: Discipline;
  places: {
    athleteId: string;
    place: number;
  }[];
}

export class SubmitContestResultDto {
  public contestId: string;
  public scores: DisciplineResultGroup[];
}

export const submitContestResultDtoSchema = Joi.object().keys({
  contestId: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown contestId')),
  scores: Joi.array()
    .required()
    .items(
      Joi.object()
        .keys({
          discipline: Joi.number()
            .required()
            .valid(CompetitionDisciplines)
            .error(new APIErrors.JoiValidationError('Invalid discipline')),
          places: Joi.array()
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
            ),
        })
        .required(),
    ),
});
