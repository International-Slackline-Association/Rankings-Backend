import { Injectable } from '@nestjs/common';

import { Discipline, DisciplineType } from 'shared/enums';
import {
  AgeCategoryUtility,
  DisciplineUtility,
  GenderUtility,
  RankingTypeUtility,
  YearUtility,
} from 'shared/enums/enums-utility';
import { ICategoryItem, UISelectOption } from 'shared/types/shared';

@Injectable()
export class CategoriesService {
  constructor() {}

  public getCategories(includeAllYears: boolean = true, includeAllDisciplines = false) {
    const rankingTypes = RankingTypeUtility.AllRankingTypes;
    const disciplines = DisciplineUtility.AllDisciplines;
    const years = includeAllYears ? YearUtility.AllYears : YearUtility.Years;
    const genders = GenderUtility.CategoricalGenders;
    const ageCategories = AgeCategoryUtility.AllAgeCategories;

    const rankingType: ICategoryItem = {
      title: 'World',
      selectedValue: rankingTypes[0].toString(),
      options: rankingTypes.map<UISelectOption>(r => {
        const parents = RankingTypeUtility.getParents(r);
        return {
          label: RankingTypeUtility.getName(r),
          value: r.toString(),
          inlineLevel: parents ? parents.length : 0,
        };
      }),
    };

    const discipline: ICategoryItem = {
      title: 'Discipline',
      selectedValue: Discipline.Trickline_Aerial.toString(),
      options: disciplines.map<UISelectOption>(d => {
        const parents = DisciplineUtility.getParents(d);
        return {
          label: DisciplineUtility.getName(d, true),
          value: d.toString(),
          isContainerStyle: DisciplineUtility.getType(d) === DisciplineType.Container,
          inlineLevel: parents ? parents.length : 0,
        };
      }),
    };
    if (includeAllDisciplines) {
      discipline.selectedValue = '0';
      discipline.options.unshift({ label: 'All', value: '0', inlineLevel: 0 });
    }

    const year: ICategoryItem = {
      title: 'Year',
      selectedValue: years[0].toString(),
      options: years.map<UISelectOption>(y => {
        return {
          label: YearUtility.getName(y),
          value: y.toString(),
          inlineLevel: YearUtility.getParents(y).length,
        };
      }),
    };

    const gender: ICategoryItem = {
      title: 'People',
      selectedValue: genders[0].toString(),
      options: genders.map<UISelectOption>(g => {
        return {
          label: GenderUtility.getName(g),
          value: g.toString(),
          inlineLevel: GenderUtility.getParents(g).length,
        };
      }),
    };

    const age: ICategoryItem = {
      title: 'Age',
      selectedValue: ageCategories[0].toString(),
      options: ageCategories.map<UISelectOption>(a => {
        return {
          label: AgeCategoryUtility.getName(a),
          value: a.toString(),
          inlineLevel: AgeCategoryUtility.getParents(a).length,
        };
      }),
    };

    return { rankingType, discipline, year, gender, age };
  }
}
