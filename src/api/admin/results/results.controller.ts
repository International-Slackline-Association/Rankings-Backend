import { Body, Controller, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsUpdateReason } from 'core/athlete/interfaces/rankings.interface';
import { RankingsService } from 'core/athlete/rankings.service';
import { ContestService } from 'core/contest/contest.service';
import { DatabaseService } from 'core/database/database.service';
import { AthleteContestRecordService } from 'dynamodb-streams/athlete/athlete-contest-record.service';
import { Discipline } from 'shared/enums';
import { logger } from 'shared/logger';
import { Utils } from 'shared/utils';
import { IResultsResponseItem, ResultsResponse } from './dto/results.response';

@Controller('results')
export class ResultsController {
  constructor(
    private readonly athleteService: AthleteService,
    private readonly contestService: ContestService,
    private readonly rankingsService: RankingsService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get(':id/:discipline')
  public async getResults(
    @Param('id') id: string,
    @Param('discipline', new ParseIntPipe())
    discipline: Discipline,
  ): Promise<ResultsResponse> {
    const results = await this.contestService.getResults(id, discipline, undefined);
    const athletesWithPlaces = await Promise.all(
      results.items.map(async item => {
        const athlete = await this.athleteService.getAthlete(item.athleteId);
        return { athlete, item };
      }),
    );
    return new ResultsResponse(
      athletesWithPlaces.map<IResultsResponseItem>(obj => ({
        id: obj.athlete.id,
        name: obj.athlete.name,
        place: obj.item.place,
        points: obj.item.points,
        surname: obj.athlete.surname,
      })),
    );
  }
  @Get('fixrankings')
  public async fixAthleteRankings(): Promise<string> {
    const id = '';
    return id;
    // return 'aa';
    // const allAthletes = await this.databaseService.queryAthletes(undefined);
    // console.log(`Total Athlete Count: ${allAthletes.items.length}`);

    // const athlete = await this.databaseService.getAthleteDetails(id);
    // if (!athlete) {
    //   return 'Athlete Not Found';
    // }
    let counter = 0;
    // for (const athlete of allAthletes.items) {
      // console.log(`Fix: ${counter++}, ${athlete.id}`);
      // if (counter < 473) {
      //   continue;
      // }

      await this.rankingsService.refreshAllRankingsOfAthlete(id);


      // const contestResults = await this.databaseService.queryAthleteContestsByDate(athlete.id, undefined);

      // for (const contestResult of contestResults.items.reverse()) {
      //   await this.rankingsService.updateRankings(
      //     athlete.id,
      //     contestResult.points,
      //     {
      //       id: contestResult.contestId,
      //       discipline: contestResult.contestDiscipline,
      //       date: contestResult.contestDate,
      //     },
      //     {
      //       reason: RankingsUpdateReason.NewContest,
      //     },
      //   );
      // }
      // await new Promise(done => setTimeout(done, 5000));
    // }
    console.log('done');
    return 'done';
  }
}
