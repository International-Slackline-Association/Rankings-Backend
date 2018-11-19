import { ContestCategory, Discipline, PrizeUnit } from 'shared/enums';
import * as Joi from 'joi';
import { JoiValidationError } from 'shared/exceptions/api.exceptions';
import { $enum } from 'ts-enum-util';

const wrappedContestCategory = $enum(ContestCategory);
const wrappedDiscipline = $enum(Discipline);
const wrappedPrizeUnit = $enum(PrizeUnit);

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
    .error(new JoiValidationError('Unknown name')),
  date: Joi.date()
    .timestamp('unix')
    .error(new JoiValidationError('Invalid date')),
  city: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown city')),
  country: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown country')),
  disciplines: Joi.array()
    .required()
    .items(
      Joi.object()
        .keys({
          discipline: Joi.number()
            .required()
            .valid(wrappedDiscipline.getValues())
            .error(new JoiValidationError('Invalid discipline')),
          category: Joi.number()
            .required()
            .valid(wrappedContestCategory.getValues())
            .error(new JoiValidationError('Invalid category')),
          prize: Joi.object().keys({
            value: Joi.number()
              .required()
              .error(new JoiValidationError('Unknown prize value')),
            unit: Joi.string()
              .required()
              .valid(wrappedPrizeUnit.getValues())
              .error(new JoiValidationError('Invalid prize unit')),
          }),
        })
        .required(),
    ),
  profilePictureUrl: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown profilePictureUrl')),
});
