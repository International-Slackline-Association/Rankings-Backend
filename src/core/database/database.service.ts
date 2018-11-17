import { Injectable } from '@nestjs/common';
import { DDBAthleteDetailsRepository } from './dynamodb/athlete/details/athlete.details.repo';
import { DDBAthleteContestsRepository } from './dynamodb/athlete/contests/athlete.contests.repo';
import { DDBAthleteRankingsRepository } from './dynamodb/athlete/rankings/athlete.rankings.repo';
import { DDBContestsRepository } from './dynamodb/contests/contests.repo';
import { DDBDisciplineContestRepository } from './dynamodb/contests/discipline/discipline.contest.repo';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly athleteDetailsRepo: DDBAthleteDetailsRepository,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly athleteRankingsRepo: DDBAthleteRankingsRepository,
    private readonly contestsRepo: DDBContestsRepository,
    private readonly disciplineContestRepo: DDBDisciplineContestRepository,
  ) {}

  public test() {
    console.log(this);
    // return this.athleteDetailsRepo.test();
    return 'test';
  }
}
