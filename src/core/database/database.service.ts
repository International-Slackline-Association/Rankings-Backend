import { Injectable } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteRankingsRepository } from './dynamodb/athlete/rankings/athlete.rankings.repo';
import { DDBContestsRepository } from './dynamodb/contests/contests.repo';
import { DDBDisciplineContestRepository } from './dynamodb/contests/discipline/discipline.contest.repo';
import { ContestInfoItemTransformer } from './dynamodb/contests/transformers/contest.entity.transformer';
import { IContestInfo, ContestInfo } from 'core/contest/entity/contestInfo';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly athleteRankingsRepo: DDBAthleteRankingsRepository,
    private readonly contestsRepo: DDBContestsRepository,
    private readonly disciplineContestRepo: DDBDisciplineContestRepository,
    private readonly transformer: ContestInfoItemTransformer,
  ) {}

  public async putContestInfo(contestInfo: ContestInfo) {
    const dbItem = this.transformer.toDBItem(contestInfo);
    await this.contestsRepo.put(dbItem);
  }
  public async getContestInfo(contestId: string, year: number) {
    const dbItem = await this.contestsRepo.get(contestId, year);
    return this.transformer.fromDBItem(dbItem);
  }
}
