import { ContestType } from './enums';
import env_variables from './env_variables';

// tslint:disable-next-line:no-namespace
export namespace Constants {
  export const BaseYear = 2015;

  export const ContestScoringRange = 16;

  export function ContestTypeTopPoints(category: ContestType): number {
    switch (category) {
      case ContestType.WorldGames:
        return 1500;
      case ContestType.WorldCup:
        return 1000;
      case ContestType.Masters:
        return 750;
      case ContestType.NationalChampionship:
        return 500;
      case ContestType.Open:
        return 125;
      case ContestType.Challenge:
        return 35;
      default:
        throw new Error('Contest Category Top Points not found: ' + category);
    }
  }
  export function ContestTypeMinParticipantsLimit(category: ContestType): number {
    if (env_variables.isDev) {
      return 2;
    }
    switch (category) {
      case ContestType.WorldGames:
        return 12;
      case ContestType.WorldCup:
        return 10;
      case ContestType.Masters:
        return 8;
      case ContestType.NationalChampionship:
        return 6;
      case ContestType.Open:
        return 4;
      case ContestType.Challenge:
        return 4;
      default:
        throw new Error('Contest Category Participant Limit not found: ' + category);
    }
  }
}
