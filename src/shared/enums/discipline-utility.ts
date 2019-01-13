import { Discipline, DisciplineType } from '.';
import { uniqWith, isEqual } from 'lodash';

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

      // container disciplines
      case Discipline.Freestyle:
      case Discipline.Walking:
        return Discipline.Overall;

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

      // 2nd degree disciplines
      case Discipline.Trickline_Aerial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Trickline_Transfer:
        return Discipline.Trickline;
      case Discipline.Speedline_Sprint:
      case Discipline.Speedline__HighLongWaterline:
        return Discipline.Speedline;

      default:
        throw new Error(`Parant discipline not found: ${discipline}`);
    }
  }

  export function getParents(discipline: Discipline) {
    const parentDisciplines: Discipline[] = [];
    const parentDiscipline = getParent(discipline);
    if (parentDiscipline !== null) {
      parentDisciplines.push(parentDiscipline, ...getParents(parentDiscipline));
    }
    return parentDisciplines;
  }

  export function getChildren(discipline: Discipline): Discipline[] {
    switch (discipline) {
      case Discipline.Overall:
        return [Discipline.Freestyle, Discipline.Walking];

      case Discipline.Freestyle:
        return [Discipline.Trickline, Discipline.Contact_HighLongWaterline];
      case Discipline.Walking:
        return [Discipline.Speedline, Discipline.Endurance, Discipline.Blind];

      case Discipline.Trickline:
        return [Discipline.Trickline_Aerial, Discipline.Trickline_JibAndStatic, Discipline.Trickline_Transfer];
      case Discipline.Speedline:
        return [Discipline.Speedline_Sprint, Discipline.Speedline__HighLongWaterline];

      case Discipline.Contact_HighLongWaterline:
      case Discipline.Endurance:
      case Discipline.Blind:
      case Discipline.Rigging:
        return [];

      case Discipline.Trickline_Aerial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Trickline_Transfer:
        return [];
      case Discipline.Speedline_Sprint:
      case Discipline.Speedline__HighLongWaterline:
        return [];
      default:
        throw new Error(`Children discipline not found: ${discipline}`);
    }
  }

  export function getAllChildren(discipline: Discipline) {
    const childrenDisciplines = getChildren(discipline);
    for (const child of childrenDisciplines) {
      childrenDisciplines.push(...getAllChildren(child));
    }
    return uniqWith(childrenDisciplines);
  }

  export function getName(discipline: Discipline, withoutParent: boolean = false) {
    switch (discipline) {
      case Discipline.Overall:
        return 'Overall';
      case Discipline.Freestyle:
        return 'Freestyle';
      case Discipline.Walking:
        return 'Walking';
      case Discipline.Trickline_Aerial:
        return withoutParent ? 'Aerial' : 'Trickline - Aerial';
      case Discipline.Trickline_JibAndStatic:
        return withoutParent ? 'Jib-Static' : 'Trickline - Jib-Static';
      case Discipline.Trickline_Transfer:
        return withoutParent ? 'Transfer' : 'Trickline - Transfer';
      case Discipline.Speedline_Sprint:
        return withoutParent ? 'Sprint' : 'Speedline - Sprint';
      case Discipline.Speedline__HighLongWaterline:
        return withoutParent ? 'High-/Long-/Waterline' : 'Speedline - High-/Long-/Waterline';

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
