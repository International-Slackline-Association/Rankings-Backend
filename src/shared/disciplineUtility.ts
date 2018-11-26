import { $enum } from 'ts-enum-util';
import { Discipline } from './enums';

const wrappedDiscipline = $enum(Discipline);

// tslint:disable-next-line:no-namespace
export namespace DisciplineUtility {
  export function getName(discipline: Discipline) {
    return wrappedDiscipline.getKeyOrDefault(discipline, discipline.toString());
  }

}
