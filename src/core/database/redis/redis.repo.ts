import { Injectable } from '@nestjs/common';
import { IHandyRedis } from 'handy-redis';
import { Discipline } from 'shared/enums';
import { Utils } from 'shared/utils';
import { DDBAthleteDetailItem } from '../dynamodb/athlete/details/athlete.details.interface';
import { DDBAthleteRankingsItemPrimaryKey } from '../dynamodb/athlete/rankings/athlete.rankings.interface';
import { DDBContestItem } from '../dynamodb/contests/contest.interface';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisRepository {
  protected keyNamePrefix = 'ISA-Rankings';
  protected seperator = ':';

  // For Lazy Connection to redis server
  protected get redis(): IHandyRedis {
    return this.redisConfig.redisClient;
  }

  constructor(public readonly redisConfig: RedisConfig) {}

  public async getAthleteDetail(athleteId: string) {
    const key = this.redisKeyOfAthleteDetails(athleteId);
    const get = this.redis.get(key).then(d => JSON.parse(d) as DDBAthleteDetailItem);
    return Utils.omitReject(get);
  }

  public async setAthleteDetail(item: DDBAthleteDetailItem) {
    if (!item) {
      return;
    }
    const key = this.redisKeyOfAthleteDetails(item.athleteId);
    const set = this.redis.set(key, JSON.stringify(item));
    return Utils.omitReject(set);
  }

  public async clearAthleteDetail(athleteId: string) {
    const key = this.redisKeyOfAthleteDetails(athleteId);
    const del = this.redis.del(key);
    return Utils.omitReject(del);
  }

  public async getContest(contestId: string, discipline: Discipline) {
    const key = this.redisKeyOfContest(contestId, discipline);
    const get = this.redis.get(key).then(d => JSON.parse(d) as DDBContestItem);
    return Utils.omitReject(get);
  }

  public async setContest(item: DDBContestItem) {
    if (!item) {
      return;
    }
    const key = this.redisKeyOfContest(item.contestId, item.discipline);
    const set = this.redis.set(key, JSON.stringify(item));
    return Utils.omitReject(set);
  }

  public async clearContest(contestId: string, discipline: Discipline) {
    const key = this.redisKeyOfContest(contestId, discipline);
    const del = this.redis.del(key);
    return Utils.omitReject(del);
  }

  public async updatePointsOfAthleteInRankingCategory(pk: DDBAthleteRankingsItemPrimaryKey, points: number) {
    const key = this.redisKeyOfRankingCategory(pk);
    const prevRank = await this.getPlaceOfAthleteInRankingCategory(pk);
    const zadd = this.redis.zadd(key, [points, pk.athleteId]);
    await Utils.omitReject(zadd);
    const currentRank = await this.getPlaceOfAthleteInRankingCategory(pk);
    // Calculate the change in the rank
    if (Utils.isSomeNil(currentRank, prevRank)) {
      return 0;
    } else {
      return -(currentRank - prevRank);
    }
  }

  public async getPlaceOfAthleteInRankingCategory(pk: DDBAthleteRankingsItemPrimaryKey) {
    const key = this.redisKeyOfRankingCategory(pk);
    const zrevrank = this.redis.zrevrank(key, pk.athleteId);
    return Utils.omitReject(zrevrank);
  }

  public async getTopScoreRankingsCronJobOffset() {
    const key = this.redisKeyOfTopScoreRankingsOffset();
    const get = this.redis.get(key);
    return Utils.omitReject(get);
  }

  public async setTopScoreRankingsCronJobOffset(offset: number) {
    const key = this.redisKeyOfTopScoreRankingsOffset();
    const get = this.redis.set(key, offset.toString());
    return Utils.omitReject(get);
  }

  protected redisKeyOfRankingCategory(pk: DDBAthleteRankingsItemPrimaryKey): string {
    return this.concatWithKeynamePrefix(
      'Rankings',
      pk.rankingType.toString(),
      pk.year.toString(),
      pk.discipline.toString(),
      pk.gender.toString(),
      pk.ageCategory.toString(),
    );
  }

  protected redisKeyOfAthleteDetails(athleteId: string): string {
    return this.concatWithKeynamePrefix('AthleteDetails', athleteId);
  }

  protected redisKeyOfContest(contesId: string, discipline: Discipline): string {
    return this.concatWithKeynamePrefix('Contest', contesId, discipline.toString());
  }

  protected redisKeyOfTopScoreRankingsOffset(): string {
    return this.concatWithKeynamePrefix('TopScoreRankingsOffset');
  }
  protected concatWithKeynamePrefix(keySpace: string, ...params: string[]): string {
    const finalKey = this.keyNamePrefix + this.seperator + keySpace;
    return this.concat(finalKey, ...params);
  }

  protected concat(keySpace: string, ...params: string[]): string {
    return Utils.concatParams(keySpace, ...params);
  }
}
