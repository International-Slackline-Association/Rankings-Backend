import * as Joi from 'joi';

import { Gender } from 'shared/enums';
import { GenderUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class SubmitAthleteDto {
  public readonly id: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly profileUrl: string;
  public readonly thumbnailUrl: string;
  public readonly country: string;
  public readonly gender: Gender;
  public readonly birthdate?: string;
  public readonly email: string;
  public readonly city: string;
  public readonly infoUrl: string;
}

// tslint:disable-next-line:max-classes-per-file
export class BatchSubmitAthleteDto {
  public readonly data: SubmitAthleteDto[];
}

export const submitAthleteDtoSchema = Joi.object().keys({
  id: Joi.string()
    .allow('')
    .optional()
    .error(new APIErrors.JoiValidationError('Unknown id')),
  name: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown name')),
  surname: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown surname')),
  profileUrl: Joi.string()
    .allow('')
    .optional()
    .uri()
    .error(new APIErrors.JoiValidationError('Unknown profileUrl')),
  thumbnailUrl: Joi.string()
    .allow('')
    .optional()
    .uri()
    .error(new APIErrors.JoiValidationError('Unknown thumbnailUrl')),
  country: Joi.string()
    .lowercase()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown country')),
  gender: Joi.number()
    .required()
    .valid(GenderUtility.ValidGenders)
    .error(new APIErrors.JoiValidationError('Invalid gender')),
  birthdate: Joi.string()
    .allow('')
    .isoDate()
    .error(new APIErrors.JoiValidationError('Invalid birthdate')),
  email: Joi.string()
    .email()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown email')),
  city: Joi.string()
    .optional()
    .allow('')
    .error(new APIErrors.JoiValidationError('Unknown city')),
  infoUrl: Joi.string()
    .allow('')
    .optional()
    // .uri()
    .error(new APIErrors.JoiValidationError('Unknown infoUrl')),
});

export const batchSubmitAthleteDtoSchema = Joi.object().keys({
  data: Joi.array().items(submitAthleteDtoSchema),
});
