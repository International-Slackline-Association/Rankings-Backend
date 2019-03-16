import * as Joi from 'joi';

import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class RankingsListDto {
  public readonly selectedCategories?: number[];
  public readonly athleteId?: string;
  public readonly country?: string;
  public readonly next?: {
    athleteId: string;
    points: number;
  };
}

export const rankingsListDtoSchema = Joi.object().keys({
  selectedCategories: Joi.array()
    .length(5)
    .allow(null)
    .optional()
    .items(
      Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown category value')),
    )
    .error(new APIErrors.JoiValidationError('Invalid categories')),
  athleteId: Joi.string()
    .allow(null, '')
    .error(new APIErrors.JoiValidationError('Invalid athleteId')),
  country: Joi.string()
    .allow(null, '')
    .lowercase()
    .error(new APIErrors.JoiValidationError('Invalid country')),
  next: Joi.object()
    .allow(null)
    .keys({
      athleteId: Joi.string()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown athleteId')),
      points: Joi.number()
        .required()
        .error(new APIErrors.JoiValidationError('Unknown points')),
    })
    .and('athleteId', 'points'),
});
