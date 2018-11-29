import { $enum } from 'ts-enum-util';
import { AgeCategory, Discipline, Gender } from './enums';

const wrappedDiscipline = $enum(Discipline);

// tslint:disable-next-line:no-namespace
export namespace DisciplineUtility {
  export function getName(discipline: Discipline) {
    return wrappedDiscipline.getKeyOrDefault(discipline, discipline.toString());
  }

  export function getParentDisciplines(discipline: Discipline) {
    switch (discipline) {
      case Discipline.Overall:
        return [];
      // 2nd degree disciplines
      case Discipline.Trickline_Arial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Trickline_TransferSingle:
      case Discipline.Trickline_TransferTandem:
        return [Discipline.Trickline, Discipline.Overall];
      case Discipline.Speedline_Sprint:
      case Discipline.Speedline__HighLongWaterline:
        return [Discipline.Speedline, Discipline.Overall];

      // 1st degree disciplines
      case Discipline.Trickline:
        return [Discipline.Overall];
      case Discipline.HighLongWaterline_Contact:
        return [Discipline.Overall];
      case Discipline.Speedline:
        return [Discipline.Overall];
      case Discipline.Endurance:
        return [Discipline.Overall];
      case Discipline.Blind:
        return [Discipline.Overall];
      case Discipline.Rigging:
        return [Discipline.Overall];
      default:
        return [Discipline.Overall];
    }
  }
}

// tslint:disable-next-line:no-namespace
export namespace EnumsUtility {
  export function getParentGenders(gender: Gender) {
    switch (gender) {
      case Gender.All:
        return [];
      default:
        return [Gender.All];
    }
  }

  export function getParentAgeCategory(category: AgeCategory) {
    switch (category) {
      case AgeCategory.All:
        return [];
      default:
        return [AgeCategory.All];
    }
  }

  export function getAgeCategoryOfAge(age: number): AgeCategory {
    if (age < 18) {
      return AgeCategory.Youth;
    }
    return AgeCategory.All;
  }
}
