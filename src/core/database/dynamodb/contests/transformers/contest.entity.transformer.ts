import { Injectable } from '@nestjs/common';
import { Contest } from 'core/contest/entity/contest';
import { DDBContestItem } from '../contests.interface';
import * as moment from 'moment';
import { unixToDate } from 'shared/utils';
import { ContestInfo } from 'core/contest/entity/contestInfo';

@Injectable()
export class ContestInfoItemTransformer {
  constructor() {}

  public toDBItem(contest: ContestInfo): DDBContestItem {
    return {
      contestId: contest.id,
      categories: contest.categories,
      city: contest.city,
      country: contest.country,
      createdAt: contest.createdAt || moment().unix(),
      date: contest.date,
      disciplines: contest.disciplines,
      name: contest.name,
      totalprize: contest.totalPrize,
      prizeUnit: contest.prizeUnit,
      profilePictureUrl: contest.profilePictureUrl,
      year: unixToDate(contest.date).year(),
    };
  }

  public fromDBItem(contest: DDBContestItem): ContestInfo {
    return {
      id: contest.contestId,
      city: contest.city,
      country: contest.country,
      createdAt: contest.createdAt,
      date: contest.date,
      categories: contest.categories,
      disciplines: contest.disciplines,
      name: contest.name,
      prizeUnit: contest.prizeUnit,
      profilePictureUrl: contest.profilePictureUrl,
      totalPrize: contest.totalprize,
    };
  }
}
