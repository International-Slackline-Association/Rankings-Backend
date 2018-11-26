import * as Joi from 'joi';
import { AgeCategory, Gender, ValidAgeCategories, ValidGenders } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class CreateAthleteDto {
  public name: string;
  public surname: string;
  public birth: number;
  public gender: Gender;
  public country: string;
  public continent: string;
  public ageCategory: AgeCategory;
  public profilePictureUrl: string;
}

export const createAthleteDtoSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown name')),
  surname: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown surname')),
  gender: Joi.number()
    .required()
    .valid(ValidGenders)
    .error(new APIErrors.JoiValidationError('Invalid gender')),
  birth: Joi.date()
    .timestamp('unix')
    .error(new APIErrors.JoiValidationError('Invalid birth')),
  country: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown country')),
  continent: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown continent')),
  ageCategory: Joi.number()
    .valid(ValidAgeCategories)
    .error(new APIErrors.JoiValidationError('Invalid ageCategory')),
  profilePictureUrl: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown profilePictureUrl')),
});
