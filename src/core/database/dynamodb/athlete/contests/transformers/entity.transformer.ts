import { AthleteContestResult } from 'core/athlete/entity/contest-result';
import * as moment from 'moment';
import { DDBAthleteContestItem } from '../athlete.contests.interface';

export class EntityTransformer {
  constructor() {}

  public toDBItem(contestResult: AthleteContestResult): DDBAthleteContestItem {
    return {
      contestId: contestResult.contestId,
      athleteId: contestResult.athleteId,
      date: contestResult.contestDate.toISODate(),
      discipline: contestResult.contestDiscipline,
      points: contestResult.points,
      place: contestResult.place,
      createdAt: contestResult.createdAt || moment().unix(),
    };
  }

  public fromDBItem(dbItem: DDBAthleteContestItem): AthleteContestResult {
    if (!dbItem) {
      return null;
    }
    return {
      contestDate: new Date(dbItem.date),
      contestDiscipline: dbItem.discipline,
      contestId: dbItem.contestId,
      createdAt: dbItem.createdAt,
      athleteId: dbItem.athleteId,
      place: dbItem.place,
      points: dbItem.points,
    };
  }
}
