import { Injectable } from '@nestjs/common';

import { Contest } from 'core/contest/entity/contest';
import { DatabaseService } from 'core/database/database.service';
import { Discipline, DisciplineType } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { Utils } from 'shared/utils';

@Injectable()
export class ContestService {
  constructor(private readonly db: DatabaseService) {}

  public async queryContests(
    limit: number,
    opts: {
      year?: number;
      discipline?: Discipline;
      contestId?: string;
      name?: string;
      after?: {
        contestId: string;
        discipline: Discipline;
        date: string;
      };
    } = {},
  ) {
    const discipline = opts.discipline;
    let filterDisciplines: Discipline[] = [];
    if (Utils.isNil(discipline) || discipline === Discipline.Overall) {
      filterDisciplines = [];
    } else {
      filterDisciplines = [discipline, ...DisciplineUtility.getAllChildren(discipline)].filter(
        d => DisciplineUtility.getType(d) === DisciplineType.Competition,
      );
    }

    const contests = await this.db.queryContestsByDate(limit, opts.year, opts.after, {
      disciplines: filterDisciplines,
      name: Utils.normalizeString(opts.name),
      id: opts.contestId,
    });
    return contests;
  }

  public async getContest(id: string, discipline: Discipline): Promise<Contest> {
    const contest = await this.db.getContest(id, discipline);
    return contest;
  }

  public async getResults(
    id: string,
    discipline: Discipline,
    limit: number,
    after?: { athleteId: string; points: number },
  ) {
    const results = await this.db.getContestResults(id, discipline, limit, after);
    return results;
  }
}
