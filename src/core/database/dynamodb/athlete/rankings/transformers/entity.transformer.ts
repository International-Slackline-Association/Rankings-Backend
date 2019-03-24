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
      country: athleteRanking.country,
      lastUpdatedAt: athleteRanking.lastUpdatedAt || moment().unix(),
      birthdate: athleteRanking.birthdate.toISODate(),
      gender: athleteRanking.gender,
      name: athleteRanking.name,
      normalizedName: Utils.normalizeString(athleteRanking.name),
      surname: athleteRanking.surname,
      discipline: athleteRanking.discipline,
      points: athleteRanking.points,
      year: athleteRanking.year,
      rankingType: athleteRanking.rankingType,
      contestCount: athleteRanking.contestCount
    };
  }

  public fromDBItem(dbItem: DDBAthleteRankingsItem): AthleteRanking {
    if (!dbItem) {
      return null;
    }
    return new AthleteRanking({
      ageCategory: dbItem.ageCategory || AgeCategory.All,
      id: dbItem.athleteId,
      country: dbItem.country,
      lastUpdatedAt: dbItem.lastUpdatedAt,
      gender: dbItem.gender,
      name: dbItem.name,
      surname: dbItem.surname,
      discipline: dbItem.discipline,
      points: dbItem.points,
      year: dbItem.year,
      birthdate: new Date(dbItem.birthdate),
      rankingType: dbItem.rankingType,
      contestCount: dbItem.contestCount,
    });
  }
}
