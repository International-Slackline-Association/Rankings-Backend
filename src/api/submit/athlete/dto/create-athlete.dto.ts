import {
  ContestCategory,
  Discipline,
  PrizeUnit,
  Gender,
  AgeCategory,
} from 'shared/enums';
import * as Joi from 'joi';
import { JoiValidationError } from 'shared/exceptions/api.exceptions';
import { $enum } from 'ts-enum-util';

const wrappedGender = $enum(Gender);
const wrappedAgeCategory = $enum(AgeCategory);

export class CreateAthleteDto {
  name: string;
  surname: string;
  birth: number;
  gender: Gender;
  country: string;
  continent: string;
  ageCategory: AgeCategory;
  profilePictureUrl: string;
}

export const createAthleteDtoSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown name')),
  surname: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown surname')),
  gender: Joi.number()
    .required()
    .valid(wrappedGender.getValues())
    .error(new JoiValidationError('Invalid gender')),
  birth: Joi.date()
    .timestamp('unix')
    .error(new JoiValidationError('Invalid birth')),
  country: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown country')),
  continent: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown continent')),
  ageCategory: Joi.number()
    .valid(wrappedAgeCategory.getValues())
    .error(new JoiValidationError('Invalid ageCategory')),
  profilePictureUrl: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown profilePictureUrl')),
});
