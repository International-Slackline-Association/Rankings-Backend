import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
import { CompetitionDisciplines, ContestCategories } from 'shared/enums';
import { ContestCategoryUtility, DisciplineUtility } from 'shared/enums-utility';
import { INamedDiscipline } from 'shared/types/shared';

@Injectable()
export class ContestService {
  constructor(private readonly db: DatabaseService) {}

  public getDisciplines() {
    const disciplines = CompetitionDisciplines;
    const namedDisciplines = disciplines.map<INamedDiscipline>(d => {
      return {
        id: d,
        name: DisciplineUtility.getName(d),
      };
    });
    return namedDisciplines;
  }

  public getCategories() {
    const categories = ContestCategories;
    const namedCategories = categories.map<INamedDiscipline>(d => {
      return {
        id: d,
        name: ContestCategoryUtility.getName(d),
      };
    });
    return namedCategories;
  }
}
