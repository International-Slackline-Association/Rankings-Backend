import * as Joi from 'joi';

import { APIErrors } from 'shared/exceptions/api.exceptions';

export class ContestResultsDto {
  public readonly next: { athleteId: string; points: number };
}

export const contestResultsDtoSchema = Joi.object().keys({
  next: Joi.object()
    .keys({
      athleteId: Joi.string()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown athleteId')),
      points: Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown points')),
    })
    .and('athleteId', 'points'),
}).allow(null);
