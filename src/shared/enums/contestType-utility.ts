import { INamedContestType } from 'shared/types/shared';
import { ContestType } from '.';

// tslint:disable-next-line:no-namespace
export namespace ContestTypeUtility {
  export const ContestTypes = [
    ContestType.WorldGames,
    ContestType.WorldCup,
    ContestType.Masters,
    ContestType.NationalChampionship,
    ContestType.Open,
    ContestType.Challenge,
  ];

  export function getName(category: ContestType) {
    switch (category) {
      case ContestType.WorldGames:
        return 'World Games';
      case ContestType.WorldCup:
        return 'World Cup';
      case ContestType.Masters:
        return 'Masters';
      case ContestType.NationalChampionship:
        return 'National Championship';
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
