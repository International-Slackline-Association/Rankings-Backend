import { Injectable } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteRankingsRepository } from './dynamodb/athlete/rankings/athlete.rankings.repo';
import { DDBDisciplineContestRepository } from './dynamodb/contests/discipline.contest.repo';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly athleteRankingsRepo: DDBAthleteRankingsRepository,
    private readonly disciplineContestRepo: DDBDisciplineContestRepository,
  ) {}

  public async putContestDiscipline(contestDiscipline: ContestDiscipline) {
    const dbItem = this.disciplineContestRepo.entityTransformer.toDBItem(
      contestDiscipline,
    );
    await this.disciplineContestRepo.put(dbItem);
  }

  public async isAthleteExists(athleteId: string) {
    return this.athleteDetailsRepo.isExists(athleteId);
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
