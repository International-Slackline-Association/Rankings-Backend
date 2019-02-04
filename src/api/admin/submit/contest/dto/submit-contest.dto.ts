import * as Joi from 'joi';
import { ContestTypeUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { APIErrors } from 'shared/exceptions/api.exceptions';

export class SubmitContestDto {
  public readonly id: string;
  public readonly name: string;
  public readonly date: string;
  public readonly city: string;
  public readonly country: string;
  public readonly discipline: number;
  public readonly contestType: number;
  public readonly prize: number;
  public readonly profileUrl: string;
  public readonly thumbnailUrl: string;
  public readonly infoUrl: string;
}

// tslint:disable-next-line:max-classes-per-file
export class BatchSubmitContestDto {
  public readonly data: SubmitContestDto[];
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
    .valid(DisciplineUtility.CompetitionDisciplines)
    .error(new APIErrors.JoiValidationError('Invalid discipline')),
  contestType: Joi.number()
    .required()
    .valid(ContestTypeUtility.ContestTypes)
    .error(new APIErrors.JoiValidationError('Invalid category')),
  prize: Joi.number()
    .required()
    .error(new APIErrors.JoiValidationError('Unknown prize')),
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
  infoUrl: Joi.string()
    .allow('')
    .optional()
    .uri()
    .error(new APIErrors.JoiValidationError('Unknown infoUrl')),
});

export const batchSubmitContestDtoSchema = Joi.object().keys({
  data: Joi.array().items(submitContestDtoSchema),
});
