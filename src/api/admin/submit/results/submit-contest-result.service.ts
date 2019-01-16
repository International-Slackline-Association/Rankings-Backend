import { Injectable } from '@nestjs/common';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { Contest } from 'core/contest/entity/contest';
import {
  AthletePointsDictionary,
  ContestPointsCalculatorService,
  DetailedContestResult,
} from 'core/contest/points-calculator.service';
import { DatabaseService } from 'core/database/database.service';
import { ContestType } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';
import { SubmitContestResultDto } from './dto/submit-contest-result.dto';

@Injectable()
export class SubmitContestResultService {
  constructor(
    private readonly db: DatabaseService,
    private readonly pointsCalculator: ContestPointsCalculatorService,
  ) {}

  public async submitContestResult(dto: SubmitContestResultDto) {
    const contest = await this.findContest(dto);

    const athletes = await this.findAthletes(dto);

    const athletePointsDict = this.calculatePoints(dto, contest.contestType);
    const failures = await this.putResultsIntoDB(contest, dto, athletePointsDict);
    if (failures.length > 0) {
      throw new APIErrors.OperationFailedError(
        'Some athlete results failed when writing to database',
        JSON.stringify(failures),
      );
    }
  }

  private async putResultsIntoDB(
    contest: Contest,
    contestResults: SubmitContestResultDto,
    athletePointsDict: AthletePointsDictionary,
  ) {
    const dbFailedAthleteResults: AthleteContestResult[] = [];
    for (const athlete of contestResults.places) {
      const { points, place } = athletePointsDict[athlete.athleteId];
      const athleteResult: AthleteContestResult = {
        contestId: contest.id,
        athleteId: athlete.athleteId,
        place: place,
        points: points,
        contestDate: contest.date,
        contestDiscipline: contest.discipline,
      };
      await this.db
        .putContestResult(athleteResult)
        .then(data => data)
        .catch(err => {
          dbFailedAthleteResults.push(athleteResult);
        });
    }
    return dbFailedAthleteResults;
  }

  private calculatePoints(contestScores: SubmitContestResultDto, category: ContestType) {
    const contestResults: DetailedContestResult = {
      contestId: contestScores.contestId,
      discipline: contestScores.discipline,
      places: contestScores.places,
      category: category,
    };
    const athletePointsDict = this.pointsCalculator.calculatePoints(contestResults);
    return athletePointsDict;
  }

  private async findContest(dto: SubmitContestResultDto) {
    const contest = await this.db.getContest(dto.contestId, dto.discipline);
    if (!contest) {
      throw new APIErrors.ContestNotFoundError(dto.contestId, dto.discipline);
    }
    return contest;
  }

  private async findAthletes(dto: SubmitContestResultDto) {
    const athleteIds = dto.places.map(athlete => {
      return athlete.athleteId;
    });
    const notFoundAthletes: string[] = [];
    const athletes = await Promise.all(
      athleteIds.map(async id => {
        const athlete = await this.db.getAthleteDetails(id);
        if (!athlete) {
          notFoundAthletes.push(id);
        }
        return athlete;
      }),
    );
    if (notFoundAthletes.length > 0) {
      throw new APIErrors.AthleteNotFoundError(notFoundAthletes);
    }
    return athletes;
  }
}
