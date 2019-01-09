import * as Joi from 'joi';

import { APIErrors } from 'shared/exceptions/api.exceptions';

export class SubmitAthletePictureDto {
  public readonly url: string;
  public readonly id: string;
}

export const submitAthletePictureDtoSchema = Joi.object().keys({
  id: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown id')),
  url: Joi.string()
    .uri()
    .error(new APIErrors.JoiValidationError('Unknown url')),
});
