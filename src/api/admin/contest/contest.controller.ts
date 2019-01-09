import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { Discipline } from 'shared/enums';
import { ContestCategoryUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { ISelectOption } from 'shared/types/shared';
import { ContestService } from './contest.service';
import { CategoriesResponse } from './dto/categories.response';
import { ContestResponse, IContestResponseItem } from './dto/contest.response';
import { DisciplinesResponse } from './dto/disciplines.response';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @Get(':id/:discipline')
  public async getContest(
    @Param('id') id: string,
    @Param('discipline', new ParseIntPipe())
    disciplineParam: Discipline,
  ): Promise<ContestResponse> {
    const contest = await this.contestService.getContest(id, disciplineParam);
    const { createdAt, date, discipline, contestCategory, ...rest } = contest;
    const item: IContestResponseItem = {
      discipline: { id: discipline, name: DisciplineUtility.getName(discipline) },
      contestCategory: { id: contestCategory, name: ContestCategoryUtility.getName(contestCategory) },
      date: date.toISODate(),
      ...rest,
    };
    return new ContestResponse(item);
  }

  @Get('disciplines')
  public getDisciplines(): DisciplinesResponse {
    const namedDisciplines = this.contestService.getDisciplines();
    const options = namedDisciplines.map<ISelectOption>(d => {
      return { label: d.name, value: d.id.toString() };
    });

    return new DisciplinesResponse(options);
  }

  @Get('categories')
  public getCategories(): CategoriesResponse {
    const categories = this.contestService.getCategories();
    const options = categories.map<ISelectOption>(d => {
      return { label: d.name, value: d.id.toString() };
    });

    return new CategoriesResponse(options);
  }
}
