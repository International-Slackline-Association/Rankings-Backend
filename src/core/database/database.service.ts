import { Injectable } from '@nestjs/common';

import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { AthleteRanking } from 'core/athlete/entity/athlete-ranking';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { Contest } from 'core/contest/entity/contest';
import { Discipline } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import {
  DDBAthleteRankingsItemPrimaryKey,
  DDBRankingsItemPrimaryKey,
} from './dynamodb/athlete/rankings/athlete.rankings.interface';
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
    // let dbItem = await this.redisRepo.getAthleteDetail(athleteId);
    // if (!dbItem) {
    //   dbItem = await this.athleteDetailsRepo.get(athleteId);
    //   await this.redisRepo.setAthleteDetail(dbItem);
    // }
    const dbItem = await this.athleteDetailsRepo.get(athleteId);
    return this.athleteDetailsRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async clearAthleteDetailsCache(athleteId: string) {
    return this.redisRepo.clearAthleteDetail(athleteId);
  }

  public async queryAthletesByName(name: string, limit: number) {
    const dbItems = await this.athleteDetailsRepo.queryAthletesByName(name, limit);
    return dbItems.map(dbItem => this.athleteDetailsRepo.entityTransformer.fromDBItem(dbItem));
  }

  public async queryAthletes(
    limit: number,
    opts: {
      after?: { athleteId: string; name: string };
      filter?: {
        fullName?: string;
      };
    } = {},
  ) {
    let queryLimit: number = limit;
    if (opts.filter && opts.filter.fullName) {
      queryLimit = 30; // random paginator;
    }
    const queryResult = await this.athleteDetailsRepo.queryAthletes(queryLimit, opts);
    let items = queryResult.items.map(dbItem => this.athleteDetailsRepo.entityTransformer.fromDBItem(dbItem));
    let lastKey = queryResult.lastKey;
    if (lastKey && items.length < limit) {
      const moreQueryResults = await this.queryAthletes(limit - items.length, {
        ...opts,
        after: queryResult.lastKey,
      });
      items = items.concat(moreQueryResults.items);
      lastKey = moreQueryResults.lastKey;
    }
    return { items, lastKey: lastKey };
  }

  public async putAthlete(athlete: AthleteDetail) {
    const dbItem = this.athleteDetailsRepo.entityTransformer.toDBItem(athlete);
    return this.athleteDetailsRepo.put(dbItem);
  }

  public async deleteAthlete(athleteId: string) {
    return this.athleteDetailsRepo.delete(athleteId);
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
    opts: {
      betweenDates?: { start: Date; end?: Date };
      after?: {
        contestId: string;
        discipline: Discipline;
        date: string;
      };
      filter?: { disciplines?: Discipline[] };
    } = {},
  ) {
    let queryLimit: number = limit;
    if (opts.filter) {
      if ((opts.filter.disciplines || []).length > 0) {
        queryLimit = Math.round(
          limit * (DisciplineUtility.CompetitionDisciplines.length / opts.filter.disciplines.length),
        );
      }
    }
    const queryResult = await this.athleteContestsRepo.queryAthleteContestsByDate(athleteId, queryLimit, opts);
    let items = queryResult.items.map(dbItem => this.athleteContestsRepo.entityTransformer.fromDBItem(dbItem));
    let lastKey = queryResult.lastKey;
    if (lastKey && items.length < limit) {
      const moreQueryResults = await this.queryAthleteContestsByDate(athleteId, limit - items.length, {
        ...opts,
        after: queryResult.lastKey,
      });
      items = items.concat(moreQueryResults.items);
      lastKey = moreQueryResults.lastKey;
    }
    return { items, lastKey: lastKey };
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
      rankingType: item.rankingType,
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

  public async updatePointsAndCountOfAthleteRanking(
    pk: DDBAthleteRankingsItemPrimaryKey,
    points: number,
    contestCount?: number,
  ) {
    await this.redisRepo.updatePointsOfAthleteInRankingCategory(pk, points);
    return this.athleteRankingsRepo.updatePointsAndCount(pk, points, contestCount);
  }
  public async deleteAthleteRankings(athleteId: string) {
    await this.athleteRankingsRepo.deleteAthleteRankings(athleteId);
  }
  public async queryAthleteRankings(
    limit: number,
    category: DDBRankingsItemPrimaryKey,
    opts: {
      after?: {
        athleteId: string;
        points: number;
      };
      filter?: { country?: string; id?: string };
    } = {},
  ) {
    let queryLimit: number = limit;
    if (opts.filter && opts.filter.country) {
      queryLimit = 30; // random paginator;
    }
    const queryResult = await this.athleteRankingsRepo.queryRankings(queryLimit, category, {
      after: opts.after,
      filter: opts.filter,
    });
    let items = queryResult.items.map(dbItem => this.athleteRankingsRepo.entityTransformer.fromDBItem(dbItem));
    let lastKey = queryResult.lastKey;
    if (lastKey && items.length < limit) {
      const moreQueryResults = await this.queryAthleteRankings(limit - items.length, category, {
        ...opts,
        after: queryResult.lastKey,
      });
      items = items.concat(moreQueryResults.items);
      lastKey = moreQueryResults.lastKey;
    }
    return { items: items, lastKey: lastKey };
  }

  //#endregion

  //#region Contest
  public async getContest(contestId: string, discipline: Discipline) {
    // Read-through cache
    // let dbItem = await this.redisRepo.getContest(contestId, discipline);
    // if (!dbItem) {
    //   dbItem = await this.contestRepo.get(contestId, discipline);
    //   await this.redisRepo.setContest(dbItem);
    // }
    const dbItem = await this.contestRepo.get(contestId, discipline);
    return this.contestRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async clearContestCache(contestId: string, discipline: Discipline) {
    return this.redisRepo.clearContest(contestId, discipline);
  }

  public async queryContestsByDate(
    limit: number,
    opts: {
      descending: boolean;
      year?: number;
      after?: {
        contestId: string;
        discipline: Discipline;
        date: string;
      };
      filter?: { disciplines?: Discipline[]; name?: string; id?: string };
    } = { descending: true },
  ) {
    let queryLimit: number = limit;
    if (opts.filter) {
      const filter = opts.filter;
      if ((filter.disciplines || []).length > 0) {
        queryLimit = Math.round(limit * (DisciplineUtility.CompetitionDisciplines.length / filter!.disciplines.length));
      }
      if (filter.name || filter.id) {
        queryLimit = 30; // random paginator;
      }
    }
    const queryResult = await this.contestRepo.queryContestsByDate(queryLimit, opts);
    let items = queryResult.items.map(dbItem => this.contestRepo.entityTransformer.fromDBItem(dbItem));
    let lastKey = queryResult.lastKey;
    if (lastKey && items.length < limit) {
      const moreQueryResults = await this.queryContestsByDate(limit - items.length, {
        ...opts,
        after: queryResult.lastKey,
      });
      items = items.concat(moreQueryResults.items);
      lastKey = moreQueryResults.lastKey;
    }
    return { items, lastKey: lastKey };
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
