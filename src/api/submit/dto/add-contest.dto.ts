import { ContestCategory, Discipline } from 'shared/enums';
import * as Joi from 'joi';
import { JoiValidationError } from 'shared/exceptions/api.exceptions';
import { $enum } from 'ts-enum-util';

const wrappedContestCategory = $enum(ContestCategory);
const wrappedDiscipline = $enum(Discipline);

export class AddContestDto {
  public id: string;
  public name: string;
  public prize: string;
  public category: ContestCategory;
  public date: number;
  public city: string;
  public country: string;
  public discipline: Discipline;
  public profilePictureUrl: string;
}

export const addContestDtoSchema = Joi.object().keys({
  name: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown name')),
  prize: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown prize')),
  category: Joi.number()
    .required()
    .valid(wrappedContestCategory.getValues())
    .error(new JoiValidationError('Invalid category')),
  date: Joi.date()
    .timestamp('unix')
    .error(new JoiValidationError('Invalid date')),
  city: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown city')),
  country: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown country')),
  discipline: Joi.number()
    .required()
    .valid(wrappedDiscipline.getValues())
    .error(new JoiValidationError('Invalid discipline')),
  profilePictureUrl: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown profilePictureUrl')),
});
