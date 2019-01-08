import * as Joi from 'joi';
import { CompetitionDisciplines, ContestCategories } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class SubmitContestDto {
  public readonly id: string;
  public readonly name: string;
  public readonly date: string;
  public readonly city: string;
  public readonly country: string;
  public readonly discipline: number;
  public readonly contestCategory: number;
  public readonly prize: number;
  public readonly profileUrl: string;
  public readonly infoUrl: string;
}

export const submitContestDtoSchema = Joi.object().keys({
  id: Joi.string()
    .allow('')
    .optional()
    .error(new APIErrors.JoiValidationError('Unknown id')),
  name: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown name')),
  date: Joi.string()
    .isoDate()
    .error(new APIErrors.JoiValidationError('Invalid date')),
  city: Joi.string()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown city')),
  country: Joi.string()
    .lowercase()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown country')),
  discipline: Joi.number()
    .required()
    .valid(CompetitionDisciplines)
    .error(new APIErrors.JoiValidationError('Invalid discipline')),
  contestCategory: Joi.number()
    .required()
    .valid(ContestCategories)
    .error(new APIErrors.JoiValidationError('Invalid category')),
  prize: Joi.number()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown prize')),
  profileUrl: Joi.string()
    .allow('')
    .optional()
    .uri()
    .error(new APIErrors.JoiValidationError('Unknown profileUrl')),
  infoUrl: Joi.string()
    .allow('')
    .optional()
    .uri()
    .error(new APIErrors.JoiValidationError('Unknown infoUrl')),
});
