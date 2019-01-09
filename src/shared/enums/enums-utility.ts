import { Utils } from 'shared/utils';
import { AgeCategory, Gender, Year } from '.';
import { ContestCategoryUtility } from './contestCategory-utility';
import { DisciplineUtility } from './discipline-utility';

export { DisciplineUtility, ContestCategoryUtility };

// tslint:disable-next-line:no-namespace
export namespace YearUtility {

  export const AllYears = [Year.All, ...Utils.yearList()];
  export const Years = Utils.yearList();

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
  export const AllGenders = [Gender.All, Gender.Men, Gender.Women];
  export const ValidGenders = [Gender.Men, Gender.Women];
  export function getName(gender: Gender) {
    switch (gender) {
      case Gender.All:
        return 'All';
      case Gender.Men:
        return 'Men';
      case Gender.Women:
        return 'Women';
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
  export const AllAgeCategories = [AgeCategory.All, AgeCategory.Youth];
  export const ValidAgeCategories = [AgeCategory.Youth];
  export function getName(category: AgeCategory) {
    switch (category) {
      case AgeCategory.All:
        return 'All';
      case AgeCategory.Youth:
        return 'Youth';
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
    return AgeCategory.All;
  }
}
