import { ContestCategory, Discipline } from 'shared/enums';
import * as Joi from 'joi';
import { JoiValidationError } from 'shared/exceptions/api.exceptions';
import { $enum } from 'ts-enum-util';

const wrappedContestCategory = $enum(ContestCategory);
const wrappedDiscipline = $enum(Discipline);

export class AddContestDisciplineDto {
  public id: string;
  public prize: string;
  public category: ContestCategory;
  public discipline: Discipline;
}

export const addContestDisciplineDtoSchema = Joi.object().keys({
  id: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown id')),
  prize: Joi.string()
    .required()
    .error(new JoiValidationError('Unknown prize')),
  category: Joi.number()
    .required()
    .valid(wrappedContestCategory.getValues())
    .error(new JoiValidationError('Invalid category')),
  discipline: Joi.number()
    .required()
    .valid(wrappedDiscipline.getValues())
    .error(new JoiValidationError('Invalid discipline')),
});
