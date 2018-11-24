import { ContestCategory, Discipline, PrizeUnit } from 'shared/enums';
import * as Joi from 'joi';
import { JoiValidationError } from 'shared/exceptions/api.exceptions';
import { $enum } from 'ts-enum-util';

const wrappedDiscipline = $enum(Discipline);

export class SubmitContestResultDto {
  contestId: string;
  scores: {
    discipline: Discipline;
    places: {
      athleteId: string;
      place: number;
    }[];
  }[];
}

export const submitContestResultDtoSchema = Joi.object().keys({
  contestId: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown contestId')),
  scores: Joi.array()
    .required()
    .items(
      Joi.object()
        .keys({
          discipline: Joi.number()
            .required()
            .valid(wrappedDiscipline.getValues())
            .error(new JoiValidationError('Invalid discipline')),
          places: Joi.array()
            .required()
            .items(
              Joi.object()
                .keys({
                  athleteId: Joi.string()
                    .required()
                    .error(new JoiValidationError('Unknown athleteId')),
                  place: Joi.number()
                    .required()
                    .error(new JoiValidationError('Unknown place')),
                })
                .required(),
            ),
        })
        .required(),
    ),
});
