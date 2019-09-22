import { Injectable } from '@nestjs/common';
import { RankingsService } from 'core/athlete/rankings.service';
import { DatabaseService } from 'core/database/database.service';
import { Utils } from 'shared/utils';

@Injectable()
export class CronJobService {
  constructor(private readonly rankingsService: RankingsService, private readonly databaseService: DatabaseService) {}

  public async runCronJobs() {
    await this.refreshRankings();
  }

  /*
  * TopScore rankings are valid in 2 year range so must be periodically updated for all athletes
  */
  private async refreshRankings() {
    const allAthletes = await this.databaseService.queryAthletes(undefined);
    console.log(`Total Athlete Count: ${allAthletes.items.length}`);

    let athleteCounter = 0;
    let offset = 0;
    const athleteIterateLimit = 100;

    // Since it takes long for lambda, we update only certain amount of athletes in a run.
    // The offset is saved every round and with the next run of this it starts from the offset.
    const cronJobOffset = await this.databaseService.getTopScoreRankingsCronJobOffset();
    if (cronJobOffset) {
      offset = parseInt(cronJobOffset, 10);
    }
    for (let index = offset; index < allAthletes.items.length; index++) {
      const athlete = allAthletes.items[index];
      if (athleteCounter > athleteIterateLimit) {
        break;
      }
      console.log(`Fix: ${index}, ${athlete.id}`);
      await this.rankingsService.refreshAllRankingsOfAthlete(athlete.id);
      athleteCounter++;
      await this.databaseService.setTopScoreRankingsCronJobOffset(index === allAthletes.items.length - 1 ? 0 : index);
    }
    console.log('done');
  }
}
