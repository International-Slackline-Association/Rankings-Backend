import { $enum } from 'ts-enum-util';
import { AgeCategory, ContestCategory, Discipline, Gender } from './enums';

const wrappedDiscipline = $enum(Discipline);

// tslint:disable-next-line:no-namespace
export namespace DisciplineUtility {
  export function getEnumName(discipline: Discipline) {
    return wrappedDiscipline.getKeyOrDefault(discipline, discipline.toString());
  }

  export function getParentDisciplines(discipline: Discipline) {
    switch (discipline) {
      case Discipline.Overall:
        return [];
      // 2nd degree disciplines
      case Discipline.Trickline_Aerial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Trickline_Transfer:
        return [Discipline.Trickline, Discipline.Overall];
      case Discipline.Speedline_Sprint:
      case Discipline.Speedline__HighLongWaterline:
        return [Discipline.Speedline, Discipline.Overall];

      // 1st degree disciplines
      case Discipline.Trickline:
        return [Discipline.Overall];
      case Discipline.Contact_HighLongWaterline:
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

  export function getName(discipline: Discipline) {
    switch (discipline) {
      case Discipline.Overall:
        return 'Overall';
      case Discipline.Trickline_Aerial:
        return 'Trickline - Aerial';
      case Discipline.Trickline_JibAndStatic:
        return 'Trickline - Jib-Static';
      case Discipline.Trickline_Transfer:
        return 'Trickline - Transfer';
      case Discipline.Speedline_Sprint:
        return 'Speedline - Sprint';
      case Discipline.Speedline__HighLongWaterline:
        return 'Speedline - High-/Long-/Waterline';

      // 1st degree disciplines
      case Discipline.Trickline:
        return 'Trickline';
      case Discipline.Contact_HighLongWaterline:
        return 'Contact - High-/Long-/Waterline';
      case Discipline.Speedline:
        return 'Speedline';
      case Discipline.Endurance:
        return 'Endurance';
      case Discipline.Blind:
        return 'Blind';
      case Discipline.Rigging:
        return 'Rigging';
      default:
        throw new Error(`Discipline name not found: ${discipline}`);
    }
  }
}

// tslint:disable-next-line:no-namespace
export namespace ContestCategoryUtility {
  export function getName(category: ContestCategory) {
    switch (category) {
      case ContestCategory.WorldGames:
        return 'World Games';
      case ContestCategory.WorldCup:
        return 'World Cup';
      case ContestCategory.Masters:
        return 'Masters';
      case ContestCategory.NationalChampionship:
        return 'National Championship';
      case ContestCategory.Open:
        return 'Open';
      case ContestCategory.Challenge:
        return 'Challenge';
      default:
        throw new Error(`Contest Category name not found: ${category}`);
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
