import * as moment from 'moment';

import { Constants } from 'shared/constants';
import { Utils } from 'shared/utils';
import { AgeCategory, Gender, RankingType, Year } from '.';
import { ContestTypeUtility } from './contestType-utility';
import { DisciplineUtility } from './discipline-utility';

export { DisciplineUtility, ContestTypeUtility };

// tslint:disable-next-line:no-namespace
export namespace YearUtility {
  export const Current = moment()
    .utc()
    .year();
  // export const Current = 2018;

  export function yearList() {
    const years: number[] = [];
    for (let year = Constants.BaseYear; year <= Current; year++) {
      years.push(year);
    }
    return years.reverse();
  }

  export const AllYears = [Year.All, ...yearList()];
  export const Years = yearList();

  export function getName(year: number) {
    switch (year) {
      case Year.All:
        return 'All';
      default:
        return year.toString();
    }
  }
  export function getParents(year: number) {
    switch (year) {
      case Year.All:
        return [];
      default:
        return [Year.All];
    }
  }
}

// tslint:disable-next-line:no-namespace
export namespace GenderUtility {
  export const AllGenders = [Gender.All, Gender.Men, Gender.Women, Gender.Other];
  export const CategoricalGenders = [Gender.All, Gender.Men, Gender.Women];
  export const ValidGenders = [Gender.Men, Gender.Women, Gender.Other];
  export function getName(gender: Gender) {
    switch (gender) {
      case Gender.All:
        return 'All';
      case Gender.Men:
        return 'Men';
      case Gender.Women:
        return 'Women';
      case Gender.Other:
        return 'Other';
    }
  }
  export function getParents(gender: Gender) {
    switch (gender) {
      case Gender.All:
        return [];
      default:
        return [Gender.All];
    }
  }
}

// tslint:disable-next-line:no-namespace
export namespace AgeCategoryUtility {
  export const AllAgeCategories = [AgeCategory.All, AgeCategory.Youth, AgeCategory.Senior];
  export const ValidAgeCategories = [AgeCategory.Youth, AgeCategory.Senior];
  export function getName(category: AgeCategory) {
    switch (category) {
      case AgeCategory.All:
        return 'All';
      case AgeCategory.Youth:
        return 'Youth (<18)';
      case AgeCategory.Senior:
        return 'Senior (>35)';
    }
  }
  export function getParents(category: AgeCategory) {
    switch (category) {
      case AgeCategory.All:
        return [];
      default:
        return [AgeCategory.All];
    }
  }

  export function getAgeCategoryOfAge(age: number): AgeCategory {
    if (age < 18) {
      return AgeCategory.Youth;
    }
    if (age > 35) {
      return AgeCategory.Senior;
    }
    return AgeCategory.All;
  }
}

// tslint:disable-next-line:no-namespace
export namespace RankingTypeUtility {
  export const AllRankingTypes = [RankingType.TopScore, RankingType.PointScore];

  export function getName(category: RankingType) {
    switch (category) {
      case RankingType.TopScore:
        return 'Top Score';
      case RankingType.PointScore:
        return 'Point Score';
    }
  }
  export function getParents(category: RankingType) {
    switch (category) {
      default:
        return [];
    }
  }
}
