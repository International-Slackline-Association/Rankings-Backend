import { Injectable } from '@nestjs/common';

import { DatabaseService } from 'core/database/database.service';
import { DDBAthleteRankingsItemPrimaryKey } from 'core/database/dynamodb/athlete/rankings/athlete.rankings.interface';
import { Constants } from 'shared/constants';
import { AgeCategory, Discipline, DisciplineType, Gender, RankingType, Year } from 'shared/enums';
import {
  AgeCategoryUtility,
  ContestTypeUtility,
  DisciplineUtility,
  GenderUtility,
  YearUtility,
} from 'shared/enums/enums-utility';
import { Utils } from 'shared/utils';
import { AthleteService } from './athlete.service';
import { AthleteDetail } from './entity/athlete-detail';
import { AthleteRanking } from './entity/athlete-ranking';
import { AthleteRankingsCategory, RankingsCategory, RankingsUpdateReason } from './interfaces/rankings.interface';

interface RankingCombination {
  year: number;
  discipline: Discipline;
  gender: Gender;
  ageCategory: AgeCategory;
}
@Injectable()
export class RankingsService {
  constructor(private readonly db: DatabaseService, private readonly athleteService: AthleteService) {}

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
    pointsToAdd: number,
    reason: RankingsUpdateReason,
  ) {
    const athlete = await this.db.getAthleteDetails(athleteId);
    if (!athlete) {
      return;
    }
    const p1 = this.updatePointScoreRankings(athlete, discipline, year, pointsToAdd, reason);
    const p2 = this.updateTopScoreRankings(athlete, discipline, year);
    await Promise.all([p1, p2]);
  }

  //#region Point Score
  private async updatePointScoreRankings(
    athlete: AthleteDetail,
    discipline: Discipline,
    year: number,
    pointsToAdd: number,
    reason?: RankingsUpdateReason,
  ) {
    const rankingType = RankingType.PointScore;
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
      promises.push(this.updatePointScoreAthleteRanking(pk, athlete, combination, pointsToAdd, reason));
    }
    await Promise.all(promises);
  }

  private async updatePointScoreAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    pointsToAdd: number,
    reason?: RankingsUpdateReason,
  ) {
    const rankingType = RankingType.PointScore;

    const athleteRanking = await this.db.getAthleteRanking(pk);
    let numberToAddToContestCount: number;
    switch (reason) {
      case RankingsUpdateReason.NewContest:
        numberToAddToContestCount = 1;
        break;
      case RankingsUpdateReason.PointsChanged:
        numberToAddToContestCount = 0;
        break;
      case RankingsUpdateReason.DeletedContest:
        numberToAddToContestCount = -1;
        break;
    }

    const rankBeforeUpdate = await this.db.getAthleteRankingPlace(pk);

    if (athleteRanking) {
      const updatedPoints = athleteRanking.points + pointsToAdd;
      let updatedContestCount: number;
      if (!Utils.isSomeNil(numberToAddToContestCount, athleteRanking.contestCount)) {
        updatedContestCount = athleteRanking.contestCount + numberToAddToContestCount;
      }
      await this.db.updateAthleteRanking(pk, updatedPoints, updatedContestCount, rankBeforeUpdate);
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
        contestCount: numberToAddToContestCount,
        previousRank: rankBeforeUpdate,
      });
      await this.db.putAthleteRanking(item);
    }
  }
  //#endregion

  //#region TopScore
  public async updateTopScoreRankings(
    athlete: AthleteDetail,
    discipline: Discipline,
    year: number,
    beforeContestDate?: Date,
  ) {
    const rankingType = RankingType.TopScore;

    const pointsDict = {};

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
      promises.push(this.updateTopScoreRankingForCombination(pk, athlete, combination, pointsDict, beforeContestDate));
    }
    await Promise.all(promises);
  }

  private async updateTopScoreRankingForCombination(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    pointsDict: {},
    beforeContestDate?: Date,
  ) {
    let points = pointsDict[`${combination.discipline}-${combination.year}`];
    if (Utils.isNil(points)) {
      points = await this.calculateNewPointsForTopScore(
        athlete.id,
        combination.discipline,
        combination.year || undefined,
        beforeContestDate,
      );
      pointsDict[`${combination.discipline}-${combination.year}`] = points;
    }
    if (points) {
      await this.updateTopScoreAthleteRanking(pk, athlete, combination, points);
    }
  }

  private async updateTopScoreAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    points: number,
  ) {
    const rankingType = RankingType.TopScore;

    const rankBeforeUpdate = await this.db.getAthleteRankingPlace(pk);

    const athleteRanking = await this.db.getAthleteRanking(pk);

    if (athleteRanking) {
      await this.db.updateAthleteRanking(pk, points, undefined, rankBeforeUpdate);
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
        points: points,
        surname: athlete.surname,
        year: combination.year,
        previousRank: rankBeforeUpdate
      });
      await this.db.putAthleteRanking(item);
    }
  }

  private async calculateNewPointsForTopScore(
    athleteId: string,
    discipline: Discipline,
    year?: number,
    beforeContestDate?: Date,
  ) {
    let betweenDates;
    if (year) {
      if (beforeContestDate) {
        betweenDates = { start: new Date(year, 0), end: beforeContestDate };
      } else {
        betweenDates = { start: new Date(year, 0), end: new Date(year + 1, 0) };
      }
    } else {
      if (beforeContestDate) {
        const startDate = Utils.dateToMoment(beforeContestDate)
          .add(-Constants.TopScoreYearRange, 'years')
          .toDate();
        betweenDates = {
          start: startDate,
          end: beforeContestDate,
        };
      } else {
        betweenDates = {
          start: Utils.DateNow()
            .add(-Constants.TopScoreYearRange, 'years')
            .toDate(),
        };
      }
    }

    const athleteContests = await this.athleteService.getContests(athleteId, discipline, undefined, betweenDates);

    const contestsByPoints = athleteContests.items.sort((a, b) => {
      return b.points - a.points;
    });

    if (contestsByPoints.length === 0) {
      return null;
    }
    const totalPoints = contestsByPoints
      .slice(0, Constants.TopScoreContestCount)
      .map(c => c.points)
      .reduce((acc, b) => acc + b);
    return totalPoints;
  }

  //#endregion

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
