import { Injectable } from '@nestjs/common';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';

import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { RankingsService } from 'core/athlete/rankings.service';
import { DatabaseService } from 'core/database/database.service';
import { DDBAthleteContestsRepository } from 'core/database/dynamodb/athlete/contests/athlete.contests.repo';
import { isRecordOfTypeOfKeys } from 'dynamodb-streams/utils';
import { logger } from 'shared/logger';
import { Utils } from 'shared/utils';

@Injectable()
export class AthleteContestRecordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
    private readonly rankingsService: RankingsService,
  ) {}

  public isRecordValidForThisService(record: StreamRecord): boolean {
    const prefixes = this.athleteContestsRepo.transformer.prefixes;
    return isRecordOfTypeOfKeys(record.Keys, prefixes);
  }

  public async processNewRecord(record: DynamoDBRecord) {
    // logger.info('DynamoDB Event', { data: record });

    if (record.eventName === 'INSERT') {
      const item = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.NewImage);
      logger.info('New Contest Record ', { data: item });
      await this.processNewContestResult(item);
    }
    if (record.eventName === 'MODIFY') {
      const oldItem = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.OldImage);
      const newItem = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.NewImage);
      logger.info('Modified Contest Record ', { data: { oldItem, newItem } });

      await this.processModifiedContestResult(oldItem, newItem);
    }
    if (record.eventName === 'REMOVE') {
      const oldItem = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.OldImage);
      logger.info('Removed Contest Record ', { data: oldItem });
      await this.processRemovedContestResult(oldItem);
    }
  }

  private async processNewContestResult(newItem: AthleteContestResult) {
    const pointsToAdd = newItem.points;
    const year = Utils.dateToMoment(newItem.contestDate).year();
    await this.rankingsService.updateRankings(newItem.athleteId, newItem.contestDiscipline, year, pointsToAdd);
  }

  private async processModifiedContestResult(oldItem: AthleteContestResult, newItem: AthleteContestResult) {
    const pointsToAdd = newItem.points - oldItem.points;
    if (pointsToAdd === 0) {
      return;
    }
    const year = Utils.dateToMoment(newItem.contestDate).year();

    await this.rankingsService.updateRankings(newItem.athleteId, newItem.contestDiscipline, year, pointsToAdd);
  }

  private async processRemovedContestResult(oldItem: AthleteContestResult) {
    const pointsToAdd = -oldItem.points;
    const year = Utils.dateToMoment(oldItem.contestDate).year();

    await this.rankingsService.updateRankings(oldItem.athleteId, oldItem.contestDiscipline, year, pointsToAdd);
  }
}
