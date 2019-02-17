import { Injectable } from '@nestjs/common';

import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DatabaseService } from 'core/database/database.service';
import { AgeCategory, Discipline, DisciplineType, Gender, Year } from 'shared/enums';
import { DisciplineUtility } from 'shared/enums/enums-utility';
import { Utils } from 'shared/utils';

@Injectable()
export class AthleteService {
  constructor(private readonly db: DatabaseService) {}

  public async queryAthletesByName(query: string, limit: number) {
    const lookup = Utils.normalizeString(query);
    const athletes = await this.db.queryAthletesByName(lookup, limit);
    return athletes;
  }

  public async queryAthletes(fullName: string, limit: number, after?: { athleteId: string; name: string }) {
    const normalizedFullName = Utils.normalizeString(fullName);
    const athletes = await this.db.queryAthletes(limit, { after, filter: { fullName: normalizedFullName } });
    return athletes;
  }

  public async getAthlete(id: string): Promise<AthleteDetail> {
    const athlete = await this.db.getAthleteDetails(id);
    return athlete;
  }

  public async getContests(
    id: string,
    discipline: Discipline,
    year?: number,
    after?: {
      contestId: string;
      discipline: Discipline;
      date: string;
    },
  ) {
    const filterDisciplines = [discipline, ...DisciplineUtility.getAllChildren(discipline)].filter(
      d => DisciplineUtility.getType(d) === DisciplineType.Competition,
    );
    const contests = await this.db.queryAthleteContestsByDate(id, 10, {
      year: year,
      after: after,
      filter: { disciplines: filterDisciplines },
    });
    return contests;
  }
}
