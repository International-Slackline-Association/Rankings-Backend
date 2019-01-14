import { INamedContestCategory } from 'shared/types/shared';
import { ContestCategory } from '.';

// tslint:disable-next-line:no-namespace
export namespace ContestCategoryUtility {
  export const ContestCategories = [
    ContestCategory.WorldGames,
    ContestCategory.WorldCup,
    ContestCategory.Masters,
    ContestCategory.NationalChampionship,
    ContestCategory.Open,
    ContestCategory.Challenge,
  ];

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

  export function getNamedContestCategory(category: ContestCategory): INamedContestCategory {
    return { id: category, name: getName(category) };
  }
}
