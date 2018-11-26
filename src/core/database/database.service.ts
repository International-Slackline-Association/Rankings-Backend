import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';
import { Discipline } from 'shared/enums';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import { DDBAthleteRankingsRepository } from './dynamodb/athlete/rankings/athlete.rankings.repo';
import { DDBDisciplineContestRepository } from './dynamodb/contests/discipline.contest.repo';
import { RedisRepository } from './redis/redis.repo';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly athleteRankingsRepo: DDBAthleteRankingsRepository,
    private readonly disciplineContestRepo: DDBDisciplineContestRepository,
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

  public async putAthlete(athlete: AthleteDetail) {
    const dbItem = this.athleteDetailsRepo.entityTransformer.toDBItem(athlete);
    return this.athleteDetailsRepo.put(dbItem);
  }

  public async putContestResult(contestResult: AthleteContestResult) {
    const dbItem = this.athleteContestsRepo.entityTransformer.toDBItem(
      contestResult,
    );
    await this.athleteContestsRepo.put(dbItem);
  }
  //#endregion

  //#region Contest
  public async getContestDiscipline(contestId: string, discipline: Discipline) {
    // Read-through cache
    let dbItem = await this.redisRepo.getContestDiscipline(
      contestId,
      discipline,
    );
    if (!dbItem) {
      dbItem = await this.disciplineContestRepo.get(contestId, discipline);
      await this.redisRepo.setContestDiscipline(dbItem);
    }
    return this.disciplineContestRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async putContestDiscipline(contestDiscipline: ContestDiscipline) {
    const dbItem = this.disciplineContestRepo.entityTransformer.toDBItem(
      contestDiscipline,
    );
    await this.disciplineContestRepo.put(dbItem);
  }
  //#endregion
}
