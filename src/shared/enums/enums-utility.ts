import * as moment from 'moment';

import { Constants } from 'shared/constants';
import { INameIdEntity } from 'shared/types/shared';
import { Utils } from 'shared/utils';
import { AgeCategory, ContestGender, Gender, RankingType, Year } from '.';
import { ContestTypeUtility } from './contestType-utility';
import { DisciplineUtility } from './discipline-utility';

export { DisciplineUtility, ContestTypeUtility };

// tslint:disable-next-line:no-namespace
export namespace YearUtility {
  export const Current = moment()
    .utc()
    .year();
  export const FutureYears = [2022];

  export function yearList() {
    const years: number[] = [];
    for (let year = Constants.BaseYear; year <= Current; year++) {
      if (!FutureYears.some(y => y === year)) {
        years.push(year);
      }
    }
    years.push(...FutureYears);
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
        return 'Youth';
      case AgeCategory.Senior:
        return 'Senior';
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

  export function getAgeCategoryOfAge(age: number | null): AgeCategory {
    if (age > 0 && age < 18) {
      return AgeCategory.Youth;
    }
    if (age > 35 && age < 70) {
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

// tslint:disable-next-line:no-namespace
export namespace ContestGenderUtility {
  export const ContestGenders = [ContestGender.Mixed, ContestGender.MenOnly, ContestGender.WomenOnly];

  export function getName(gender: ContestGender) {
    switch (gender) {
      case ContestGender.Mixed:
        return 'Mixed';
      case ContestGender.MenOnly:
        return 'Men';
      case ContestGender.WomenOnly:
        return 'Women';
    }
  }
  export function getParents(gender: ContestGender) {
    switch (gender) {
      default:
        return [];
    }
  }

  export function getNamedContestGender(gender: ContestGender): INameIdEntity {
    return { id: gender, name: getName(gender) };
  }
}
