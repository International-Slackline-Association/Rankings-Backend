import { Injectable } from '@nestjs/common';
import { DynamoDBRecord, StreamRecord } from 'aws-lambda';

import { AthleteRanking } from 'core/athlete/entity/athlete-ranking';
import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import { DatabaseService } from 'core/database/database.service';
import { DDBAthleteContestsRepository } from 'core/database/dynamodb/athlete/contests/athlete.contests.repo';
import { isRecordOfTypeOfKeys } from 'dynamodb-streams/utils';
import { AgeCategory, Discipline, Gender } from 'shared/enums';
import { AgeCategoryUtility, DisciplineUtility, GenderUtility, YearUtility } from 'shared/enums/enums-utility';
import { logger } from 'shared/logger';
import { Utils } from 'shared/utils';

interface RankingCombination {
  year: number;
  discipline: Discipline;
  gender: Gender;
  ageCategory: AgeCategory;
}
@Injectable()
export class AthleteContestRecordService {
  constructor(
    private readonly db: DatabaseService,
    private readonly athleteContestsRepo: DDBAthleteContestsRepository,
  ) {}

  public isRecordValidForThisService(record: StreamRecord): boolean {
    const prefixes = this.athleteContestsRepo.transformer.prefixes;
    return isRecordOfTypeOfKeys(record.Keys, prefixes);
  }

  public async processNewRecord(record: DynamoDBRecord) {
    if (record.eventName === 'INSERT') {
      const item = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.NewImage);
      logger.debug('New Contest Record ', { item });
      await this.processNewContestResult(item);
    }
    if (record.eventName === 'MODIFY') {
      const oldItem = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.OldImage);
      const newItem = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.NewImage);
      logger.debug('Modified Contest Record ', { oldItem, newItem });

      await this.processModifiedContestResult(oldItem, newItem);
    }
    if (record.eventName === 'REMOVE') {
      const oldItem = this.athleteContestsRepo.transformFromDynamoDBType(record.dynamodb.OldImage);
      logger.debug('Removed Contest Record ', { oldItem });

      await this.processRemovedContestResult(oldItem);
    }
  }

  private async processNewContestResult(newItem: AthleteContestResult) {
    const pointsToAdd = newItem.points;
    const year = Utils.dateToMoment(newItem.contestDate).year();
    await this.updateRankingsForCombinations(newItem.athleteId, newItem.contestDiscipline, year, pointsToAdd);
  }

  private async processModifiedContestResult(oldItem: AthleteContestResult, newItem: AthleteContestResult) {
    const pointsToAdd = newItem.points - oldItem.points;
    if (pointsToAdd === 0) {
      return;
    }
    const year = Utils.dateToMoment(newItem.contestDate).year();

    await this.updateRankingsForCombinations(newItem.athleteId, newItem.contestDiscipline, year, pointsToAdd);
  }

  private async processRemovedContestResult(oldItem: AthleteContestResult) {
    const pointsToAdd = -oldItem.points;
    const year = Utils.dateToMoment(oldItem.contestDate).year();

    await this.updateRankingsForCombinations(oldItem.athleteId, oldItem.contestDiscipline, year, pointsToAdd);
  }

  private async updateRankingsForCombinations(
    athleteId: string,
    discipline: Discipline,
    year: number,
    pointsToAdd: number,
  ) {
    const athlete = await this.db.getAthleteDetails(athleteId);
    if (!athlete) {
      return;
    }
    const combinations = this.generateAllCombinationsWithParentCategories(
      year,
      discipline,
      athlete.gender,
      athlete.ageCategory,
    );

    for (const combination of combinations) {
      const pk = {
        ageCategory: combination.ageCategory,
        athleteId: athlete.id,
        discipline: combination.discipline,
        gender: combination.gender,
        year: combination.year,
      };
      const athleteRanking = await this.db.getAthleteRanking(pk);
      if (athleteRanking) {
        const updatedPoints = athleteRanking.points + pointsToAdd;
        await this.db.updatePointsOfAthleteRanking(pk, updatedPoints);
      } else {
        const item = new AthleteRanking({
          ageCategory: combination.ageCategory,
          country: athlete.country,
          discipline: combination.discipline,
          gender: combination.gender,
          id: athlete.id,
          name: athlete.name,
          birthdate: athlete.birthdate,
          points: pointsToAdd,
          surname: athlete.surname,
          year: combination.year,
        });
        await this.db.putAthleteRanking(item);
      }
    }
  }
  private generateAllCombinationsWithParentCategories(
    year: number,
    discipline: Discipline,
    gender: Gender,
    ageCategory: AgeCategory,
  ) {
    const allYears = [year, ...YearUtility.getParents(year)];
    const allDisciplines = [discipline, ...DisciplineUtility.getParents(discipline)];
    const allGenders = [gender, ...GenderUtility.getParents(gender)];
    const allAgeCategories = [ageCategory, ...AgeCategoryUtility.getParents(ageCategory)];

    const combinations: RankingCombination[] = [];
    for (const y of allYears) {
      for (const d of allDisciplines) {
        for (const g of allGenders) {
          for (const a of allAgeCategories) {
            if (!Utils.isNil(y) && !Utils.isNil(d) && !Utils.isNil(g) && !Utils.isNil(a)) {
              combinations.push({ year: y, discipline: d, gender: g, ageCategory: a });
            }
          }
        }
      }
    }
    return combinations;
  }
}
