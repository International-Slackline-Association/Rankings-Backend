import { INamedContestType } from 'shared/types/shared';
import { ContestType } from '.';

// tslint:disable-next-line:no-namespace
export namespace ContestTypeUtility {
  export const ContestTypes = [
    ContestType.WorldChampionship,
    ContestType.WorldCup,
    ContestType.Masters,
    ContestType.GrandSlam,
    ContestType.Open,
    ContestType.Challenge,
  ];

  export const ContestTypesBySize = [
    ContestType.WorldChampionship,
    ContestType.WorldCup,
    ContestType.Masters,
    ContestType.GrandSlam,
    ContestType.Open,
    ContestType.Challenge,
  ];

  export function getName(category: ContestType) {
    switch (category) {
      case ContestType.WorldChampionship:
        return 'World Championship';
      case ContestType.WorldCup:
        return 'World Cup';
      case ContestType.Masters:
        return 'Masters';
      case ContestType.GrandSlam:
        return 'Grand Slam';
      case ContestType.Open:
        return 'Open';
      case ContestType.Challenge:
        return 'Challenge';
      default:
        throw new Error(`Contest Category name not found: ${category}`);
    }
  }

  export function getNamedContestType(category: ContestType): INamedContestType {
    return { id: category, name: getName(category) };
  }
}
