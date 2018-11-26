import { Injectable } from '@nestjs/common';
import { IHandyRedis } from 'handy-redis';
import { Discipline } from 'shared/enums';
import { Utils } from 'shared/utils';
import { DDBAthleteDetailItem } from '../dynamodb/athlete/details/athlete.details.interface';
import { DDBDisciplineContestItem } from '../dynamodb/contests/discipline.contest.interface';
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

  public async test() {
    return this.redis.get('test');
  }

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

  public async getContestDiscipline(contestId: string, discipline: Discipline) {
    const key = this.redisKeyOfContestDiscipline(contestId, discipline);
    const get = this.redis.get(key).then(d => JSON.parse(d) as DDBDisciplineContestItem);
    return Utils.omitReject(get);
  }

  public async setContestDiscipline(item: DDBDisciplineContestItem) {
    if (!item) {
      return;
    }
    const key = this.redisKeyOfContestDiscipline(item.contestId, item.discipline);
    const set = this.redis.set(key, JSON.stringify(item));
    return Utils.omitReject(set);
  }

  protected redisKeyOfAthleteDetails(athleteId: string): string {
    return this.concatWithKeynamePrefix('AthleteDetails', athleteId);
  }

  protected redisKeyOfContestDiscipline(contesId: string, discipline: Discipline): string {
    return this.concatWithKeynamePrefix('ContestDiscipline', contesId, discipline.toString());
  }

  protected concatWithKeynamePrefix(keySpace: string, ...params: string[]): string {
    const finalKey = this.keyNamePrefix + this.seperator + keySpace;
    return this.concat(finalKey, ...params);
  }

  protected concat(keySpace: string, ...params: string[]): string {
    return Utils.concatParams(keySpace, ...params);
  }
}
