import { Injectable } from '@nestjs/common';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';
// tslint:disable-next-line:max-line-length
import { ContestPointsCalculatorService, DetailedDisciplineResultGroup, DisciplineResultsGroupCalculated } from 'core/contest/points-calculator.service';
import { DatabaseService } from 'core/database/database.service';
import { ContestCategory } from 'shared/enums';
import { APIErrors } from 'shared/exceptions/api.exceptions';
import { DisciplineResultGroup, SubmitContestResultDto } from './dto/submit-contest-result.dto';

@Injectable()
export class SubmitContestResultService {
  constructor(
    private readonly db: DatabaseService,
    private readonly pointsCalculator: ContestPointsCalculatorService,
  ) {}

  public async submitContestResult(submitContestResultdto: SubmitContestResultDto) {
    const contestId = submitContestResultdto.contestId;

    const contestDisciplines = await this.findContestDisciplines(submitContestResultdto);

    const athletes = await this.findAthletes(submitContestResultdto);

    const calculatedScores = submitContestResultdto.scores.map(scores => {
      return this.calculatePointsForDisciplineGroup(
        scores,
        contestDisciplines.find(d => d.discipline === scores.discipline).category,
      );
    });

    const failures = await this.putResultsIntoDB(contestId, contestDisciplines, calculatedScores);
    if (failures.length > 0) {
      throw new APIErrors.OperationFailedError(
        'Some athlete results failed when writing to database',
        JSON.stringify(failures),
      );
    }
  }

  private async putResultsIntoDB(
    contestId: string,
    contestDisciplines: ContestDiscipline[],
    calculatedScores: DisciplineResultsGroupCalculated[],
  ) {
    const dbFailedAthleteResults: AthleteContestResult[] = [];
    for (const disciplineGroup of calculatedScores) {
      const contest = contestDisciplines.find(d => d.discipline === disciplineGroup.discipline);
      for (const result of disciplineGroup.results) {
        const athleteResult: AthleteContestResult = {
          contestId: contestId,
          athleteId: result.athleteId,
          place: result.place,
          points: result.points,
          contestDate: contest.date,
          contestDiscipline: disciplineGroup.discipline,
        };
        await this.db
          .putContestResult(athleteResult)
          .then(data => data)
          .catch(err => {
            dbFailedAthleteResults.push(athleteResult);
          });
      }
    }
    return dbFailedAthleteResults;
  }

  private calculatePointsForDisciplineGroup(disciplineGroup: DisciplineResultGroup, category: ContestCategory) {
    const resultGroup: DetailedDisciplineResultGroup = {
      discipline: disciplineGroup.discipline,
      category: category,
      places: disciplineGroup.places,
    };
    const calculatedResultGroup = this.pointsCalculator.calculatePointsAndPlace(resultGroup);
    return calculatedResultGroup;
  }

  private async findContestDisciplines(submitContestResultdto: SubmitContestResultDto) {
    const contestId = submitContestResultdto.contestId;
    const contestDisciplinesGroup = submitContestResultdto.scores.map(disciplineGroup => {
      return {
        contestId: contestId,
        discipline: disciplineGroup.discipline,
      };
    });
    const contestDisciplines = await Promise.all(
      contestDisciplinesGroup.map(async cd => {
        const contestDiscipline = await this.db.getContestDiscipline(cd.contestId, cd.discipline);
        if (!contestDiscipline) {
          throw new APIErrors.ContestNotFoundError(cd.contestId, cd.discipline);
        }
        return contestDiscipline;
      }),
    );
    return contestDisciplines;
  }

  private async findAthletes(submitContestResultdto: SubmitContestResultDto) {
    const athleteIds = submitContestResultdto.scores
      .map(disciplineGroup => {
        return disciplineGroup.places.map(p => p.athleteId);
      })
      .reduce((a, b) => a.concat(b), []);
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
