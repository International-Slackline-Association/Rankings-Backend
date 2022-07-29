import { uniqWith } from 'lodash';

import { INamedDiscipline } from 'shared/types/shared';
import { Discipline, DisciplineType } from '.';

// tslint:disable-next-line:no-namespace
export namespace DisciplineUtility {
  export const CategoricalDisciplines = [];

  export const ContainerDisciplines = [Discipline.Freestyle, Discipline.Speed];

  export const CompetitionDisciplines = [
    Discipline.Trickline_Aerial,
    Discipline.Trickline_JibAndStatic,
    Discipline.Freestyle_Highline,
    Discipline.Speedline_Short,
    Discipline.Speedline_Highline,
    Discipline.Rigging,
  ];

  export const AllDisciplines = [
    Discipline.Freestyle,
    Discipline.Trickline_Aerial,
    Discipline.Trickline_JibAndStatic,
    Discipline.Freestyle_Highline,
    Discipline.Speed,
    Discipline.Speedline_Short,
    Discipline.Speedline_Highline,
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
    return undefined;
  }

  export function getParent(discipline: Discipline): Discipline | null {
    switch (discipline) {
      // container disciplines
      case Discipline.Freestyle:
      case Discipline.Speed:
        return null;

      // 1st degree disciplines
      case Discipline.Rigging:
        return null;

      // 2nd degree disciplines
      case Discipline.Trickline_Aerial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Freestyle_Highline:
        return Discipline.Freestyle;
      case Discipline.Speedline_Short:
      case Discipline.Speedline_Highline:
        return Discipline.Speed;

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
        return [Discipline.Freestyle, Discipline.Speed, Discipline.Rigging];
      case Discipline.Freestyle:
        return [Discipline.Trickline_Aerial, Discipline.Trickline_JibAndStatic, Discipline.Freestyle_Highline];
      case Discipline.Speed:
        return [Discipline.Speedline_Highline, Discipline.Speedline_Short];
      case Discipline.Rigging:
        return [];
      case Discipline.Trickline_Aerial:
      case Discipline.Trickline_JibAndStatic:
      case Discipline.Freestyle_Highline:
        return [];
      case Discipline.Speedline_Highline:
      case Discipline.Speedline_Short:
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
      case Discipline.Speed:
        return 'Speed';
      case Discipline.Trickline_Aerial:
        return withoutParent ? 'Trickline' : 'Freestyle - Aerial';
      case Discipline.Trickline_JibAndStatic:
        return withoutParent ? 'Jib-Static' : 'Freestyle - Jib-Static';
      case Discipline.Trickline_Transfer:
        return withoutParent ? 'Transfer' : 'Freestyle - Transfer';
      case Discipline.Freestyle_Highline:
        return withoutParent ? 'Highline' : 'Freestyle - Highline';
      case Discipline.Speedline_Highline:
        return withoutParent ? 'Highline' : 'Speed - Highline';
      case Discipline.Speedline_Short:
        return withoutParent ? 'Short' : 'Speed - Short';
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

  export function getNamedDiscipline(discipline: Discipline): INamedDiscipline {
    return { id: discipline, name: getName(discipline) };
  }
}
