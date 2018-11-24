import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { unixToDate } from 'shared/utils';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';
import { DDBDisciplineContestItem } from '../discipline.contest.interface';

export class EntityTransformer {
  constructor() {}

  public toDBItem(contest: ContestDiscipline): DDBDisciplineContestItem {
    return {
      contestId: contest.id,
      category: contest.category,
      city: contest.city,
      country: contest.country,
      createdAt: contest.createdAt || moment().unix(),
      date: contest.date,
      discipline: contest.discipline,
      name: contest.name,
      prize: contest.prize,
      prizeUnit: contest.prizeUnit,
      year: unixToDate(contest.date).year(),
      profilePictureUrl: contest.profilePictureUrl,
    };
  }

  public fromDBItem(contest: DDBDisciplineContestItem): ContestDiscipline {
    if (!contest) return null;
    return {
      id: contest.contestId,
      city: contest.city,
      country: contest.country,
      createdAt: contest.createdAt,
      date: contest.date,
      category: contest.category,
      discipline: contest.discipline,
      name: contest.name,
      prizeUnit: contest.prizeUnit,
      prize: contest.prize,
      profilePictureUrl: contest.profilePictureUrl,
    };
  }
}
