import * as Joi from 'joi';
import { CompetitionDisciplines, ContestCategory, Discipline, PrizeUnit } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';
import { $enum } from 'ts-enum-util';

const contestCategories = $enum(ContestCategory).getValues();
const prizeUnits = $enum(PrizeUnit).getValues();

export class CreateContestDto {
  public name: string;
  public date: number;
  public city: string;
  public country: string;
  public disciplines: {
    discipline: Discipline;
    category: ContestCategory;
    prize: {
      value: number;
      unit: PrizeUnit;
    };
  }[];
  public profilePictureUrl: string;
}

export const createContestDtoSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown name')),
  date: Joi.date()
    .timestamp('unix')
    .error(new APIErrors.JoiValidationError('Invalid date')),
  city: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown city')),
  country: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown country')),
  disciplines: Joi.array()
    .required()
    .items(
      Joi.object()
        .keys({
          discipline: Joi.number()
            .required()
            .valid(CompetitionDisciplines)
            .error(new APIErrors.JoiValidationError('Invalid discipline')),
          category: Joi.number()
            .required()
            .valid(contestCategories)
            .error(new APIErrors.JoiValidationError('Invalid category')),
          prize: Joi.object().keys({
            value: Joi.number()
              .required()
              .error(new APIErrors.JoiValidationError('Unknown prize value')),
            unit: Joi.string()
              .required()
              .valid(prizeUnits)
              .error(new APIErrors.JoiValidationError('Invalid prize unit')),
          }),
        })
        .required(),
    ),
  profilePictureUrl: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown profilePictureUrl')),
});
