import { ContestCategory } from './enums';

// tslint:disable-next-line:no-namespace
export namespace Constants {
  export const ScoringRange = 32;

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
}
