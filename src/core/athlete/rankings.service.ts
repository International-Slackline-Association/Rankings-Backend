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
    pointsToAdd: number,
    contest: { id: string; discipline: Discipline; date: Date },
    meta: { reason: RankingsUpdateReason },
  ) {
    const athlete = await this.db.getAthleteDetails(athleteId);
    if (!athlete) {
      return;
    }
    const p1 = this.updatePointScoreRankings(athlete, pointsToAdd, contest, meta);
    const p2 = this.updateTopScoreRankings(athlete, contest);
    await Promise.all([p1, p2]);
  }

  //#region Point Score
  private async updatePointScoreRankings(
    athlete: AthleteDetail,
    pointsToAdd: number,
    contest: { id: string; discipline: Discipline; date: Date },
    meta: { reason: RankingsUpdateReason },
  ) {
    const rankingType = RankingType.PointScore;
    const combinations = this.generateAllCombinationsWithParentCategories(
      Utils.dateToMoment(contest.date).year(),
      contest.discipline,
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
      promises.push(
        this.updatePointScoreAthleteRanking(pk, athlete, combination, pointsToAdd, {
          contestId: contest.id,
          reason: meta.reason,
        }),
      );
    }
    await Promise.all(promises);
  }

  private async updatePointScoreAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    pointsToAdd: number,
    meta: {
      reason?: RankingsUpdateReason;
      contestId: string;
    },
  ) {
    const rankingType = RankingType.PointScore;

    const athleteRanking = await this.db.getAthleteRanking(pk);
    let numberToAddToContestCount: number;
    switch (meta.reason) {
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

    // let rankBeforeUpdate = await this.db.getAthleteRankingPlace(pk);
    let rankBeforeUpdate = await this.db.getAthleteRankingPlace(pk);

    if (athleteRanking) {
      const updatedPoints = athleteRanking.points + pointsToAdd;
      let updatedContestCount: number;
      if (!Utils.isSomeNil(numberToAddToContestCount, athleteRanking.contestCount)) {
        updatedContestCount = athleteRanking.contestCount + numberToAddToContestCount;
      }
      if (athleteRanking.points === updatedPoints || athleteRanking.latestUpdateWithContest === meta.contestId) {
        rankBeforeUpdate = undefined; // Dont change rank if the update is with same contest
      }
      if (
        athleteRanking.points !== updatedPoints ||
        athleteRanking.latestUpdateWithContest !== meta.contestId ||
        athleteRanking.contestCount !== updatedContestCount
      ) {
        await this.db.updateAthleteRanking(pk, updatedPoints, meta.contestId, rankBeforeUpdate, updatedContestCount);
      }
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
        rankBeforeLatestContest: rankBeforeUpdate,
        latestUpdateWithContest: meta.contestId,
      });
      await this.db.putAthleteRanking(item);
    }
  }
  //#endregion

  //#region TopScore
  public async updateTopScoreRankings(
    athlete: AthleteDetail,
    contest: { id: string; discipline: Discipline; date: Date },
    meta?: {
      beforeContestDate?: Date;
    },
  ) {
    const rankingType = RankingType.TopScore;

    const pointsDict = {};

    const combinations = this.generateAllCombinationsWithParentCategories(
      Utils.dateToMoment(contest.date).year(),
      contest.discipline,
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
      const points = await this.calculateNewPointsForTopScore(
        athlete.id,
        combination.discipline,
        pointsDict,
        combination.year || undefined,
        meta && meta.beforeContestDate,
      );
      if (points) {
        promises.push(this.updateTopScoreAthleteRanking(pk, athlete, combination, points, { contestId: contest.id }));
      }
    }
    await Promise.all(promises);
  }

  private async updateTopScoreAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    points: number,
    meta: { contestId: string },
  ) {
    const rankingType = RankingType.TopScore;

    let rankBeforeUpdate = await this.db.getAthleteRankingPlace(pk);

    const athleteRanking = await this.db.getAthleteRanking(pk);

    if (athleteRanking) {
      if (athleteRanking.points === points || athleteRanking.latestUpdateWithContest === meta.contestId) {
        rankBeforeUpdate = undefined; // Dont change rank if the update is with same contest
      }
      if (athleteRanking.points !== points || athleteRanking.latestUpdateWithContest !== meta.contestId) {
        await this.db.updateAthleteRanking(pk, points, meta.contestId, rankBeforeUpdate, undefined);
      }
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
        rankBeforeLatestContest: rankBeforeUpdate,
        latestUpdateWithContest: meta.contestId,
      });
      await this.db.putAthleteRanking(item);
    }
  }

  private async calculateNewPointsForTopScore(
    athleteId: string,
    discipline: Discipline,
    pointsDict: {},
    year?: number,
    beforeContestDate?: Date,
  ) {
    const points = pointsDict[`${discipline}-${year}`];
    if (!Utils.isNil(points)) {
      return points;
    }

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

    pointsDict[`${discipline}-${year}`] = totalPoints;
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
