import { ContestType } from './enums';
import env_variables from './env_variables';

// tslint:disable-next-line:no-namespace
export namespace Constants {
  export const BaseYear = 2017;
  export const TopScoreContestCount = 2;
  export const TopScoreYearRange = 2;

  export function ContestTypeTopPoints(category: ContestType): number {
    switch (category) {
      case ContestType.WorldGames:
        return 2000;
      case ContestType.WorldCup:
        return 1500;
      case ContestType.Masters:
        return 900;
      case ContestType.GrandSlam:
        return 600;
      case ContestType.Open:
        return 300;
      case ContestType.Challenge:
        return 150;
      default:
        throw new Error('Contest Category Top Points not found: ' + category);
    }
  }

  export function ContestScoringRange(category: ContestType): number {
    switch (category) {
      case ContestType.WorldGames:
        return 18;
      case ContestType.WorldCup:
        return 16;
      case ContestType.Masters:
        return 14;
      case ContestType.GrandSlam:
        return 12;
      case ContestType.Open:
        return 10;
      case ContestType.Challenge:
        return 8;
      default:
        throw new Error('Contest Scoring Range not found: ' + category);
    }
  }

  export function ContestTypeMinParticipantsLimit(category: ContestType): number {
    if (env_variables.isDev) {
      return 2;
    }
    switch (category) {
      case ContestType.WorldGames:
        return 11;
      case ContestType.WorldCup:
        return 9;
      case ContestType.Masters:
        return 7;
      case ContestType.GrandSlam:
        return 5;
      case ContestType.Open:
        return 3;
      case ContestType.Challenge:
        return 3;
      default:
        throw new Error('Contest Category Participant Limit not found: ' + category);
    }
  }
}
