import { AthleteRanking } from 'core/athlete/entity/athlete-ranking';
import * as moment from 'moment';
import { AgeCategory } from 'shared/enums';
import { Utils } from 'shared/utils';
import { DDBAthleteRankingsItem } from '../athlete.rankings.interface';

export class EntityTransformer {
  constructor() {}

  public toDBItem(athleteRanking: AthleteRanking): DDBAthleteRankingsItem {
    return {
      ageCategory: athleteRanking.ageCategory,
      athleteId: athleteRanking.id,
      continent: athleteRanking.continent,
      country: athleteRanking.country,
      lastUpdatedAt: athleteRanking.lastUpdatedAt || moment().unix(),
      gender: athleteRanking.gender,
      name: athleteRanking.name,
      normalizedName: Utils.normalizeStringForSearching(athleteRanking.name),
      surname: athleteRanking.surname,
      discipline: athleteRanking.discipline,
      points: athleteRanking.points,
      year: athleteRanking.year,
    };
  }

  public fromDBItem(dbItem: DDBAthleteRankingsItem): AthleteRanking {
    if (!dbItem) {
      return null;
    }
    return {
      ageCategory: dbItem.ageCategory || AgeCategory.All,
      id: dbItem.athleteId,
      continent: dbItem.continent,
      country: dbItem.country,
      lastUpdatedAt: dbItem.lastUpdatedAt,
      gender: dbItem.gender,
      name: dbItem.name,
      surname: dbItem.surname,
      discipline: dbItem.discipline,
      points: dbItem.points,
      year: dbItem.year,
    };
  }
}
