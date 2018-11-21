import { Injectable } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteRankingsRepository } from './dynamodb/athlete/rankings/athlete.rankings.repo';
import { DDBContestsRepository } from './dynamodb/contests/contests.repo';
import { DDBDisciplineContestRepository } from './dynamodb/contests/discipline/discipline.contest.repo';
import { ContestInfoItemTransformer } from './dynamodb/contests/transformers/entity.transformer';
import { ContestInfo } from 'core/contest/entity/contestInfo';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';
// tslint:disable-next-line:max-line-length
import { DisciplineContestItemTransformer } from './dynamodb/contests/discipline/transformers/entity.transformer';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly athleteRankingsRepo: DDBAthleteRankingsRepository,
    private readonly contestsRepo: DDBContestsRepository,
    private readonly disciplineContestRepo: DDBDisciplineContestRepository,
  ) {}

  public async putContestInfo(contestInfo: ContestInfo) {
    const dbItem = this.contestsRepo.entityTransformer.toDBItem(contestInfo);
    await this.contestsRepo.put(dbItem);
  }
  public async getContestInfo(contestId: string, year: number) {
    const dbItem = await this.contestsRepo.get(contestId, year);
    return this.contestsRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async putContestDiscipline(contestDiscipline: ContestDiscipline) {
    const dbItem = this.disciplineContestRepo.entityTransformer.toDBItem(
      contestDiscipline,
    );
    await this.disciplineContestRepo.put(dbItem);
  }

  public async getAthleteDetails(athleteId: string) {
    const dbItem = await this.athleteDetailsRepo.get(athleteId);
    return this.athleteDetailsRepo.entityTransformer.fromDBItem(dbItem);
  }

  public async putAthlete(athlete: AthleteDetail) {
    const dbItem = this.athleteDetailsRepo.entityTransformer.toDBItem(athlete);
    return this.athleteDetailsRepo.put(dbItem);
  }
}
