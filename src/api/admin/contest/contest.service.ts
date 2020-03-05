import { Injectable } from '@nestjs/common';
import { Contest } from 'core/contest/entity/contest';
import { DatabaseService } from 'core/database/database.service';
import { Discipline } from 'shared/enums';
import { ContestGenderUtility, ContestTypeUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { INamedDiscipline, INameIdEntity } from 'shared/types/shared';

@Injectable()
export class ContestService {
  constructor(private readonly db: DatabaseService) {}

  public async getContest(id: string, discipline: Discipline): Promise<Contest> {
    const contest = await this.db.getContest(id, discipline);
    return contest;
  }

  public getDisciplines() {
    const disciplines = DisciplineUtility.CompetitionDisciplines;
    const namedDisciplines = disciplines.map<INamedDiscipline>(d => {
      return DisciplineUtility.getNamedDiscipline(d);
    });
    return namedDisciplines;
  }

  public getCategories() {
    const categories = ContestTypeUtility.ContestTypes;
    const namedCategories = categories.map<INamedDiscipline>(d => {
      return ContestTypeUtility.getNamedContestType(d);
    });
    return namedCategories;
  }

  public async deleteContest(id: string, discipline: Discipline) {
    const results = await this.db.queryContestResults(id, discipline, undefined);
    if (results.items.length <= 0) {
      await this.db.deleteContest(id, discipline);
      return true;
    }
    return false;
  }

  public getGenders() {
    const genders = ContestGenderUtility.ContestGenders;
    const namedGenders = genders.map<INameIdEntity>(d => {
      return ContestGenderUtility.getNamedContestGender(d);
    });
    return namedGenders;
  }
}
