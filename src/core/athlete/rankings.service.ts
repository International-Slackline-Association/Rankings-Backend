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

  public async refreshAllRankingsOfAthlete(athleteId: string) {
    await this.db.deleteAthleteRankings(athleteId);

    const contestResults = await this.db.queryAthleteContestsByDate(athleteId, undefined);

    for (const contestResult of contestResults.items.reverse()) {
      await this.updateRankings(athleteId, contestResult.points, {
        id: contestResult.contestId,
        discipline: contestResult.contestDiscipline,
        date: contestResult.contestDate,
      });
    }
  }

  public async updateRankings(
    athleteId: string,
    pointsToAdd: number,
    contest: { id: string; discipline: Discipline; date: Date },
  ) {
    const athlete = await this.db.getAthleteDetails(athleteId);
    if (!athlete) {
      return;
    }
    const p1 = this.updatePointScoreRankings(athlete, pointsToAdd, contest);
    const p2 = this.updateTopScoreRankings(athlete, contest);
    const updateRankings = await Promise.all([p1, p2]);
    return updateRankings[0].concat(updateRankings[1]);
    // return p2;
  }

  //#region Point Score
  private async updatePointScoreRankings(
    athlete: AthleteDetail,
    pointsToAdd: number,
    contest: { id: string; discipline: Discipline; date: Date },
  ) {
    const rankingType = RankingType.PointScore;
    const combinations = this.generateAllCombinationsWithParentCategories(
      Utils.dateToMoment(contest.date).year(),
      contest.discipline,
      athlete.gender,
      athlete.ageCategory,
    );
    const promises: Promise<AthleteRanking>[] = [];
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
        }),
      );
    }
    const updatedRankings = await Promise.all(promises);
    return updatedRankings;
  }

  private async updatePointScoreAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    pointsToAdd: number,
    meta: {
      contestId: string;
    },
  ): Promise<AthleteRanking> {
    const rankingType = RankingType.PointScore;

    const athleteRanking = await this.db.getAthleteRanking(pk);

    let rankingItem: AthleteRanking;

    if (athleteRanking) {
      const updatedPoints = athleteRanking.points + pointsToAdd;

      rankingItem = new AthleteRanking({
        rankingType: athleteRanking.rankingType,
        ageCategory: athleteRanking.ageCategory,
        country: athlete.country,
        discipline: athleteRanking.discipline,
        gender: athleteRanking.gender,
        id: athleteRanking.id,
        name: athlete.name,
        birthdate: athlete.birthdate,
        surname: athlete.surname,
        year: athleteRanking.year,
        points: updatedPoints,
      });
    } else {
      rankingItem = new AthleteRanking({
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
    }
    await this.db.putAthleteRanking(rankingItem);
    return rankingItem;
  }
  //#endregion

  //#region TopScore
  public async updateTopScoreRankings(
    athlete: AthleteDetail,
    contest: { id: string; discipline: Discipline; date: Date },
  ) {
    const rankingType = RankingType.TopScore;

    const pointsDict = {};

    const combinations = this.generateAllCombinationsWithParentCategories(
      Utils.dateToMoment(contest.date).year(),
      contest.discipline,
      athlete.gender,
      athlete.ageCategory,
    );
    const promises: Promise<AthleteRanking>[] = [];
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
      );
      if (points) {
        promises.push(this.updateTopScoreAthleteRanking(pk, athlete, combination, points));
      }
    }
    const updatedRankings = await Promise.all(promises);
    return updatedRankings;
  }

  private async updateTopScoreAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    athlete: AthleteDetail,
    combination: RankingCombination,
    points: number,
  ) {
    const rankingType = RankingType.TopScore;

    const athleteRanking = await this.db.getAthleteRanking(pk);
    let rankingItem: AthleteRanking;

    if (athleteRanking) {
      rankingItem = new AthleteRanking({
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
      });
    }
    rankingItem = new AthleteRanking({
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
    });
    await this.db.putAthleteRanking(rankingItem);
    return rankingItem;
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

  private isAthleteRankingsEqual(r1: AthleteRanking, r2: AthleteRanking) {
    if (r1.rankingType !== r2.rankingType) {
      return false;
    }
    if (r1.year !== r2.year) {
      return false;
    }
    if (r1.gender !== r2.gender) {
      return false;
    }
    if (r1.ageCategory !== r2.ageCategory) {
      return false;
    }
    if (r1.discipline !== r2.discipline) {
      return false;
    }
    return true;
  }
}
