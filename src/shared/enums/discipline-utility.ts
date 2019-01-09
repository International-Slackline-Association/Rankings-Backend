import { Discipline, DisciplineType } from '.';

// tslint:disable-next-line:no-namespace
export namespace DisciplineUtility {
  export const CategoricalDisciplines = [Discipline.Overall, Discipline.Trickline, Discipline.Speedline];

  export const ContainerDisciplines = [Discipline.Freestyle, Discipline.Walking];

  export const CompetitionDisciplines = [
    Discipline.Trickline_Aerial,
    Discipline.Trickline_JibAndStatic,
    Discipline.Trickline_Transfer,
    Discipline.Contact_HighLongWaterline,
    Discipline.Speedline_Sprint,
    Discipline.Speedline__HighLongWaterline,
    Discipline.Endurance,
    Discipline.Blind,
    Discipline.Rigging,
  ];

  export const AllDisciplines = [
    Discipline.Overall,
    Discipline.Freestyle,
    Discipline.Trickline,
    Discipline.Trickline_Aerial,
    Discipline.Trickline_JibAndStatic,
    Discipline.Trickline_Transfer,
    Discipline.Contact_HighLongWaterline,
    Discipline.Walking,
    Discipline.Speedline,
    Discipline.Speedline_Sprint,
    Discipline.Speedline__HighLongWaterline,
    Discipline.Endurance,
    Discipline.Blind,
    Discipline.Rigging,
  ];

  export function getType(discipline: Discipline): DisciplineType {
    if (CompetitionDisciplines.indexOf(discipline) > -1) {
      return DisciplineType.Competition;
    }
    if (ContainerDisciplines.indexOf(discipline) > -1) {
      return DisciplineType.Container;
    }
    if (CategoricalDisciplines.indexOf(discipline) > -1) {
      return DisciplineType.Category;
    }
    throw new Error('Cannot find type of discipline: ' + discipline);
  }

  export function getParent(discipline: Discipline): Discipline | null {
    switch (discipline) {
      case Discipline.Overall:
        return null;
      case Discipline.Freestyle:
      case Discipline.Walking:
        return Discipline.Overall;

      // 2nd degree disciplines
      case Discipline.Trickline_Aerial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Trickline_Transfer:
        return Discipline.Trickline;
      case Discipline.Speedline_Sprint:
      case Discipline.Speedline__HighLongWaterline:
        return Discipline.Speedline;

      // 1st degree disciplines
      case Discipline.Trickline:
        return Discipline.Freestyle;
      case Discipline.Contact_HighLongWaterline:
        return Discipline.Freestyle;
      case Discipline.Speedline:
        return Discipline.Walking;
      case Discipline.Endurance:
        return Discipline.Walking;
      case Discipline.Blind:
        return Discipline.Walking;
      case Discipline.Rigging:
        return Discipline.Overall;
      default:
        throw new Error(`Parante discipline not found: ${discipline}`);
    }
  }

  export function getParents(discipline: Discipline) {
    const parentDisciplines: Discipline[] = [];
    let parentDiscipline = getParent(discipline);
    while (parentDiscipline !== null) {
      parentDisciplines.push(parentDiscipline);
      parentDiscipline = getParent(parentDiscipline);
    }
    return parentDisciplines;
  }

  export function getName(discipline: Discipline, withoutCategories: boolean = false) {
    switch (discipline) {
      case Discipline.Overall:
        return 'Overall';
      case Discipline.Freestyle:
        return 'Freestyle';
      case Discipline.Walking:
        return 'Walking';
      case Discipline.Trickline_Aerial:
        return withoutCategories ? 'Aerial' : 'Trickline - Aerial';
      case Discipline.Trickline_JibAndStatic:
        return withoutCategories ? 'Jib-Static' : 'Trickline - Jib-Static';
      case Discipline.Trickline_Transfer:
        return withoutCategories ? 'Transfer' : 'Trickline - Transfer';
      case Discipline.Speedline_Sprint:
        return withoutCategories ? 'Sprint' : 'Speedline - Sprint';
      case Discipline.Speedline__HighLongWaterline:
        return withoutCategories ? 'High-/Long-/Waterline' : 'Speedline - High-/Long-/Waterline';

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
