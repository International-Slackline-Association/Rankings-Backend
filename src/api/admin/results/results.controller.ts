import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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
  @Post('fixrankings/:id')
  public async fixAthleteRankings(@Param('id') id: string): Promise<string> {
    const allAthletes = await this.databaseService.queryAthletes(undefined);
    console.log(`Total Athlete Count: ${allAthletes.items.length}`);

    // const athlete = await this.databaseService.getAthleteDetails(id);
    // if (!athlete) {
    //   return 'Athlete Not Found';
    // }
    let counter = 0;
    for (const athlete of allAthletes.items) {
      console.log(`Fix: ${counter++}, ${athlete.id}`);
      if (counter < 127) {
        continue;
      }
      // const rankings = await this.databaseService.getAllAthleteRankings(athlete.id);
      // for (const ranking of rankings.items) {
      //   const pk = {
      //     rankingType: ranking.rankingType,
      //     ageCategory: ranking.ageCategory,
      //     athleteId: athlete.id,
      //     discipline: ranking.discipline,
      //     gender: ranking.gender,
      //     year: ranking.year,
      //   };
      //   await this.databaseService.updateAthleteRanking(pk, ranking.points, ranking.contestCount);
      // }
      await this.databaseService.deleteAthleteRankings(athlete.id);

      const contestResults = await this.databaseService.queryAthleteContestsByDate(athlete.id, undefined);

      for (const contestResult of contestResults.items.reverse()) {
        const year = Utils.dateToMoment(contestResult.contestDate).year();

        await this.rankingsService.updateRankings(
          athlete.id,
          contestResult.contestDiscipline,
          year,
          contestResult.points,
          RankingsUpdateReason.NewContest,
        );
        // await this.rankingsService.updateTopScoreRankings(
        //   athlete,
        //   contestResult.contestDiscipline,
        //   year,
        //   contestResult.contestDate,
        // );
      }
      await new Promise(done => setTimeout(done, 3000));
    }
    console.log('done');
    return 'done';
  }
}
