import { ContestCategory } from './enums';

// tslint:disable-next-line:no-namespace
export namespace Constants {
  export const ContestScoringRange = 16;

  export function ContestCategoryTopPoints(category: ContestCategory): number {
    switch (category) {
      case ContestCategory.WorldGames:
        return 1500;
      case ContestCategory.WorldCup:
        return 1000;
      case ContestCategory.Masters:
        return 750;
      case ContestCategory.NationalChampionship:
        return 500;
      case ContestCategory.Open:
        return 125;
      case ContestCategory.Challenge:
        return 35;
    }
  }
  export function ContestCategoryMinParticipantsLimit(category: ContestCategory): number {
    switch (category) {
      case ContestCategory.WorldGames:
        return 12;
      case ContestCategory.WorldCup:
        return 10;
      case ContestCategory.Masters:
        return 8;
      case ContestCategory.NationalChampionship:
        return 6;
      case ContestCategory.Open:
        return 4;
      case ContestCategory.Challenge:
        return 4;
    }
  }
}
