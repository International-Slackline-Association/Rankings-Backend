import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { AthleteRanking } from 'core/athlete/entity/athlete-ranking';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { Contest } from 'core/contest/entity/contest';
import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import { DDBAthleteRankingsItemPrimaryKey } from './dynamodb/athlete/rankings/athlete.rankings.interface';
import { DDBAthleteRankingsRepository } from './dynamodb/athlete/rankings/athlete.rankings.repo';
import { DDBContestRepository } from './dynamodb/contests/contest.repo';
import { RedisRepository } from './redis/redis.repo';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly athleteRankingsRepo: DDBAthleteRankingsRepository,
    private readonly contestRepo: DDBContestRepository,
    private readonly redisRepo: RedisRepository,
  ) {}

  public terminateConnections() {
    if (this.redisRepo.redisConfig.isRedisConfigured) {
      this.redisRepo.redisConfig.redisClient.quit();
    }
  }

  //#region Athlete
  public async isAthleteExists(athleteId: string) {
    return this.athleteDetailsRepo.isExists(athleteId);
  }

  public async getAthleteDetails(athleteId: string) {
    // Read-through cache
    let dbItem = await this.redisRepo.getAthleteDetail(athleteId);
    if (!dbItem) {
      dbItem = await this.athleteDetailsRepo.get(athleteId);
      await this.redisRepo.setAthleteDetail(dbItem);
    }
    return this.athleteDetailsRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async clearAthleteDetailsCache(athleteId: string) {
    return this.redisRepo.clearAthleteDetail(athleteId);
  }

  public async queryAthletesByName(name: string, limit: number) {
    const dbItems = await this.athleteDetailsRepo.queryAthletesByName(name, limit);
    return dbItems.map(dbItem => this.athleteDetailsRepo.entityTransformer.fromDBItem(dbItem));
  }

  public async putAthlete(athlete: AthleteDetail) {
    const dbItem = this.athleteDetailsRepo.entityTransformer.toDBItem(athlete);
    return this.athleteDetailsRepo.put(dbItem);
  }

  public async updateAthleteProfileUrl(athleteId: string, url: string) {
    return this.athleteDetailsRepo.updateProfileUrl(athleteId, url);
  }

  public async putContestResult(contestResult: AthleteContestResult) {
    const dbItem = this.athleteContestsRepo.entityTransformer.toDBItem(contestResult);
    await this.athleteContestsRepo.put(dbItem);
  }

  public async getContestResults(
    contestId: string,
    discipline: Discipline,
    limit: number,
    after?: { athleteId: string; points: number },
  ) {
    const dbItems = await this.athleteContestsRepo.queryContestAthletes(contestId, discipline, limit, after);
    const items = dbItems.items.map(dbItem => this.athleteContestsRepo.entityTransformer.fromDBItem(dbItem));
    return { items, lastKey: dbItems.lastKey };
  }

  public async queryAthleteContestsByDate(
    athleteId: string,
    limit: number,
    year?: number,
    after?: {
      contestId: string;
      discipline: Discipline;
      date: string;
    },
    filter: { disciplines?: Discipline[] } = { disciplines: [] },
  ) {
    let queryLimit: number = limit;
    if (filter) {
      if ((filter.disciplines || []).length > 0) {
        queryLimit = Math.round(limit * (DisciplineUtility.CompetitionDisciplines.length / filter!.disciplines.length));
      }
    }
    const queryResult = await this.athleteContestsRepo.queryAthleteContestsByDate(
      athleteId,
      queryLimit,
      year,
      after,
      filter,
    );
    let items = queryResult.items.map(dbItem => this.athleteContestsRepo.entityTransformer.fromDBItem(dbItem));
    let lastKey = queryResult.lastKey;
    if (lastKey && items.length < limit) {
      const moreQueryResults = await this.queryAthleteContestsByDate(
        athleteId,
        limit - items.length,
        year,
        queryResult.lastKey,
        filter,
      );
      items = items.concat(moreQueryResults.items);
      lastKey = queryResult.lastKey;
    }
    return { items: items.slice(0, limit), lastKey: lastKey };
  }

  public async getAthleteRanking(pk: DDBAthleteRankingsItemPrimaryKey) {
    const dbItem = await this.athleteRankingsRepo.get(pk);
    return this.athleteRankingsRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async getAthleteRankingPlace(pk: DDBAthleteRankingsItemPrimaryKey) {
    const place = await this.redisRepo.getPlaceOfAthleteInRankingCategory(pk);
    return place;
  }

  public async putAthleteRanking(item: AthleteRanking) {
    const pk: DDBAthleteRankingsItemPrimaryKey = {
      ageCategory: item.ageCategory,
      athleteId: item.id,
      discipline: item.discipline,
      gender: item.gender,
      year: item.year,
    };
    await this.redisRepo.updatePointsOfAthleteInRankingCategory(pk, item.points);
    const dbItem = this.athleteRankingsRepo.entityTransformer.toDBItem(item);
    await this.athleteRankingsRepo.put(dbItem);
  }

  public async updatePointsOfAthleteRanking(pk: DDBAthleteRankingsItemPrimaryKey, points: number) {
    await this.redisRepo.updatePointsOfAthleteInRankingCategory(pk, points);
    return this.athleteRankingsRepo.updatePoints(pk, points);
  }

  //#endregion

  //#region Contest
  public async getContest(contestId: string, discipline: Discipline) {
    // Read-through cache
    let dbItem = await this.redisRepo.getContest(contestId, discipline);
    if (!dbItem) {
      dbItem = await this.contestRepo.get(contestId, discipline);
      await this.redisRepo.setContest(dbItem);
    }
    return this.contestRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async queryContestsByDate(
    limit: number,
    year?: number,
    after?: {
      contestId: string;
      discipline: Discipline;
      date: string;
    },
    filter: { disciplines?: Discipline[]; name?: string } = { disciplines: [], name: undefined },
  ) {
    let queryLimit: number = limit;
    if (filter) {
      if ((filter.disciplines || []).length > 0) {
        queryLimit = Math.round(limit * (DisciplineUtility.CompetitionDisciplines.length / filter!.disciplines.length));
      }
      if (filter.name) {
        queryLimit = 30; // random paginator;
      }
    }
    const queryResult = await this.contestRepo.queryContestsByDate(queryLimit, year, after, filter);
    let items = queryResult.items.map(dbItem => this.contestRepo.entityTransformer.fromDBItem(dbItem));
    let lastKey = queryResult.lastKey;
    if (lastKey && items.length < limit) {
      const moreQueryResults = await this.queryContestsByDate(limit - items.length, year, queryResult.lastKey, filter);
      items = items.concat(moreQueryResults.items);
      lastKey = queryResult.lastKey;
    }
    return { items: items.slice(0, limit), lastKey: lastKey };
  }

  public async putContest(contest: Contest) {
    const dbItem = this.contestRepo.entityTransformer.toDBItem(contest);
    await this.contestRepo.put(dbItem);
  }
  public async updateContestProfileUrl(contestId: string, discipline: Discipline, url: string) {
    return this.contestRepo.updateProfileUrl(contestId, discipline, url);
  }

  //#endregion
}
