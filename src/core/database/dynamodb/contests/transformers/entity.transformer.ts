import { Contest } from 'core/contest/entity/contest';
import * as moment from 'moment';
import { Utils } from 'shared/utils';
import { DDBContestItem } from '../contest.interface';

export class EntityTransformer {
  constructor() {}

  public toDBItem(contest: Contest): DDBContestItem {
    return {
      contestId: contest.id,
      category: contest.contestCategory,
      city: contest.city,
      country: contest.country,
      createdAt: contest.createdAt || moment().unix(),
      date: contest.date.toISOString().split('T')[0],
      discipline: contest.discipline,
      name: contest.name,
      normalizedName: Utils.normalizeString(contest.name),
      prize: contest.prize,
      year: Utils.dateToMoment(contest.date).year(),
      profileUrl: contest.profileUrl || undefined,
      infoUrl: contest.infoUrl || undefined,
    };
  }

  public fromDBItem(contest: DDBContestItem): Contest {
    if (!contest) {
      return null;
    }
    return new Contest({
      id: contest.contestId,
      city: contest.city,
      country: contest.country,
      createdAt: contest.createdAt,
      date: new Date(contest.date),
      contestCategory: contest.category,
      discipline: contest.discipline,
      name: contest.name,
      prize: contest.prize,
      profileUrl: contest.profileUrl || '',
      infoUrl: contest.infoUrl || '',
    });
  }
}
