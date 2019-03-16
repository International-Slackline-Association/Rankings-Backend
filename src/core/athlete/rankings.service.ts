import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'core/database/database.service';
import { DDBAthleteRankingsItemPrimaryKey } from 'core/database/dynamodb/athlete/rankings/athlete.rankings.interface';
import { Constants } from 'shared/constants';
import { AgeCategory, Discipline, Gender, RankingType, Year } from 'shared/enums';
import {
  AgeCategoryUtility,
  ContestTypeUtility,
  DisciplineUtility,
  GenderUtility,
  YearUtility,
} from 'shared/enums/enums-utility';
import { Utils } from 'shared/utils';
import { AthleteDetail } from './entity/athlete-detail';
import { AthleteRanking } from './entity/athlete-ranking';
import { AthleteRankingsCategory, RankingsCategory } from './interfaces/rankings.interface';

interface RankingCombination {
  year: number;
  discipline: Discipline;
  gender: Gender;
  ageCategory: AgeCategory;
}
@Injectable()
export class RankingsService {
  constructor(private readonly db: DatabaseService) {}

  public async getOverallRank(athleteId: string) {
    const category: AthleteRankingsCategory = {
      rankingType: RankingType.TopScore,
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

  public async updateRankings(
    athleteId: string,
    discipline: Discipline,
    year: number,
    pointsToAddToScorePoint: number,
  ) {
    const athlete = await this.db.getAthleteDetails(athleteId);
    if (!athlete) {
      return;
    }
    const p1 = this.updatePointScoreRankings(athlete, discipline, year, pointsToAddToScorePoint);
    const p2 = this.updateTopScoreRankings(athlete, discipline, year);
    await Promise.all([p1, p2]);
  }

  private async updatePointScoreRankings(
    athlete: AthleteDetail,
    discipline: Discipline,
    year: number,
    pointsToAdd: number,
  ) {
    await this.updateRankingsCombinations(athlete, RankingType.PointScore, discipline, year, pointsToAdd);
  }

  public async updateTopScoreRankings(athlete: AthleteDetail, discipline: Discipline, year: number) {
    const pointsToAddToTopScore = await this.calculatePointsToAddForTopScore(athlete, discipline, year);

    if (pointsToAddToTopScore !== 0) {
      await this.updateRankingsCombinations(athlete, RankingType.TopScore, discipline, year, pointsToAddToTopScore);
    }
  }

  public async calculatePointsToAddForTopScore(athlete: AthleteDetail, discipline: Discipline, year: number) {
    const newTopScoreOfDiscipline = await this.calculateNewPointsForTopScore(athlete.id, discipline, year);
    if (Utils.isNil(newTopScoreOfDiscipline)) {
      return 0;
    }
    const pk = {
      rankingType: RankingType.TopScore,
      ageCategory: athlete.ageCategory,
      athleteId: athlete.id,
      discipline: discipline,
      gender: athlete.gender,
      year: year,
    };
    const athleteRanking = await this.db.getAthleteRanking(pk);
    let pointsToAdd = 0;
    if (athleteRanking) {
      pointsToAdd = newTopScoreOfDiscipline - athleteRanking.points;
    } else {
      pointsToAdd = newTopScoreOfDiscipline;
    }
    return pointsToAdd;
  }

  public async calculateNewPointsForTopScore(athleteId: string, discipline: Discipline, year: number) {
    const athleteContests = await this.db.queryAthleteContestsByDate(athleteId, undefined, {
      year: year,
      filter: { disciplines: [discipline] },
    });
    const contests = await Promise.all(
      athleteContests.items.map(async athleteContest => {
        const c = await this.db.getContest(athleteContest.contestId, athleteContest.contestDiscipline);
        return c;
      }),
    );
    contests.sort((a, b) => {
      if (a.contestType === b.contestType) {
        return a.date < b.date ? 1 : -1;
      } else {
        return (
          ContestTypeUtility.ContestTypesBySize.indexOf(a.contestType) -
          ContestTypeUtility.ContestTypesBySize.indexOf(b.contestType)
        );
      }
    });
    const contestsToConsider = contests.slice(0, Constants.TopScoreContestCount);
    if (contestsToConsider.length < Constants.TopScoreContestCount) {
      return null;
    }
    const averagePoints =
      athleteContests.items
        .filter(i => contestsToConsider.find(c => c.id === i.contestId))
        .map(c => c.points)
        .reduce((acc, b) => acc + b) / Constants.TopScoreContestCount;
    return averagePoints;
  }

  public async updateRankingsCombinations(
    athlete: AthleteDetail,
    rankingType: RankingType,
    discipline: Discipline,
    year: number,
    pointsToAdd: number,
  ) {
    const combinations = this.generateAllCombinationsWithParentCategories(
      year,
      discipline,
      athlete.gender,
      athlete.ageCategory,
    );
    const promises = [];
    for (const combination of combinations) {
      const pk = {
        rankingType: rankingType,
        ageCategory: combination.ageCategory,
        athleteId: athlete.id,
        discipline: combination.discipline,
        gender: combination.gender,
        year: combination.year,
      };
      promises.push(this.updateAthleteRanking(pk, athlete, combination, rankingType, pointsToAdd));
    }
    await Promise.all(promises);
  }

  private async updateAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    rankingType: RankingType,
    pointsToAdd: number,
  ) {
    const athleteRanking = await this.db.getAthleteRanking(pk);
    if (athleteRanking) {
      const updatedPoints = athleteRanking.points + pointsToAdd;
      await this.db.updatePointsOfAthleteRanking(pk, updatedPoints);
    } else {
      const item = new AthleteRanking({
        rankingType: rankingType,
        ageCategory: combination.ageCategory,
        country: athlete.country,
        discipline: combination.discipline,
        gender: combination.gender,
        id: athlete.id,
        name: athlete.name,
        birthdate: athlete.birthdate,
        points: pointsToAdd,
        surname: athlete.surname,
        year: combination.year,
      });
      await this.db.putAthleteRanking(item);
    }
  }
  private generateAllCombinationsWithParentCategories(
    year: number,
    discipline: Discipline,
    gender: Gender,
    ageCategory: AgeCategory,
  ) {
    const allYears = [year, ...YearUtility.getParents(year)];
    const allDisciplines = [discipline, ...DisciplineUtility.getParents(discipline)];
    const allGenders = [gender, ...GenderUtility.getParents(gender)];
    const allAgeCategories = [ageCategory, ...AgeCategoryUtility.getParents(ageCategory)];

    const combinations: RankingCombination[] = [];
    for (const y of allYears) {
      for (const d of allDisciplines) {
        for (const g of allGenders) {
          for (const a of allAgeCategories) {
            if (!Utils.isNil(y) && !Utils.isNil(d) && !Utils.isNil(g) && !Utils.isNil(a)) {
              combinations.push({ year: y, discipline: d, gender: g, ageCategory: a });
            }
          }
        }
      }
    }
    return combinations;
  }
}
