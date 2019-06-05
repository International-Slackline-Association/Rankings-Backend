import { Injectable } from '@nestjs/common';
import { RankingsService } from 'core/athlete/rankings.service';
import { DatabaseService } from 'core/database/database.service';
import { Utils } from 'shared/utils';

@Injectable()
export class CronJobService {
  constructor(private readonly rankingsService: RankingsService, private readonly databaseService: DatabaseService) {}

  public async runCronJobs() {
    await this.updateAllTopScoreRankings();
  }

  /*
  * TopScore rankings are valid in 2 year range so must be periodically updated for all athlets
  */
  private async updateAllTopScoreRankings() {
    const allAthletes = await this.databaseService.queryAthletes(undefined);
    console.log(`Total Athlete Count: ${allAthletes.items.length}`);

    // const athlete = await this.databaseService.getAthleteDetails(id);
    // if (!athlete) {
    //   return 'Athlete Not Found';
    // }
    let counter = 0;
    let offset = 0;
    const iterateLimit = 30;

    // Since dynamodb capacity is set low, we update only certain amount of athletes in a run.
    // The offset is saved every round and with the next run of this it starts from the offset.
    const cronJobOffset = await this.databaseService.getTopScoreRankingsCronJobOffset();
    if (cronJobOffset) {
      offset = parseInt(cronJobOffset, 10);
    }
    for (let index = offset; index < allAthletes.items.length; index++) {
      const athlete = allAthletes.items[index];
      if (counter > iterateLimit) {
        break;
      }
      counter++;
      console.log(`Fix: ${index}, ${athlete.id}`);
      const disciplineYearDict = {};
      const contestResults = await this.databaseService.queryAthleteContestsByDate(athlete.id, undefined);
      for (const contestResult of contestResults.items) {
        const year = Utils.dateToMoment(contestResult.contestDate).year();
        if (disciplineYearDict[`${contestResult.contestDiscipline}-${year}`]) {
          // if updated before
          continue;
        }
        await this.rankingsService.updateTopScoreRankings(athlete, contestResult.contestDiscipline, year);
        disciplineYearDict[`${contestResult.contestDiscipline}-${year}`] = true;
      }

      await this.databaseService.setTopScoreRankingsCronJobOffset(index === allAthletes.items.length - 1 ? 0 : index);
    }
    console.log('done');
  }
}
