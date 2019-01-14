import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'core/database/database.service';
import { AgeCategory, Discipline, DisciplineType, Gender, Year } from 'shared/enums';
import { AthleteRankingsCategory, RankingsCategory } from './interfaces/rankings.interface';

@Injectable()
export class RankingsService {
  constructor(private readonly db: DatabaseService) {}

  public async getOverallRank(athleteId: string) {
    const category: AthleteRankingsCategory = {
      ageCategory: AgeCategory.All,
      athleteId: athleteId,
      discipline: Discipline.Overall,
      gender: Gender.All,
      year: Year.All,
    };
    return this.getAthleteRankInCategory(category);
  }

  public async getAthleteRankInCategory(category: AthleteRankingsCategory) {
    return this.db.getAthleteRankingPlace(category);
  }

  public async queryRankings(
    limit: number,
    category: RankingsCategory,
    opts: {
      athleteId?: string;
      country?: string;
      after?: {
        athleteId: string;
        points: number;
      };
    } = {},
  ) {
    if (opts.athleteId) {
      limit = 1;
    }

    const rankings = await this.db.queryAthleteRankings(limit, category, {
      after: opts.after,
      filter: {
        id: opts.athleteId,
        country: opts.country,
      },
    });
    return rankings;
  }
}
