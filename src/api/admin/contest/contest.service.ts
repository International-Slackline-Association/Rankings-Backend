import { Injectable } from '@nestjs/common';
import { Contest } from 'core/contest/entity/contest';
import { DatabaseService } from 'core/database/database.service';
import { Discipline } from 'shared/enums';
import { ContestCategoryUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { INamedDiscipline } from 'shared/types/shared';

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
      return {
        id: d,
        name: DisciplineUtility.getName(d),
      };
    });
    return namedDisciplines;
  }

  public getCategories() {
    const categories = ContestCategoryUtility.ContestCategories;
    const namedCategories = categories.map<INamedDiscipline>(d => {
      return {
        id: d,
        name: ContestCategoryUtility.getName(d),
      };
    });
    return namedCategories;
  }
}
