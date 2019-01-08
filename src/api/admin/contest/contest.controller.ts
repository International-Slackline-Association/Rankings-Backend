import { Controller, Get, Param, Req } from '@nestjs/common';
import { ISelectOption } from 'shared/types/shared';
import { ContestService } from './contest.service';
import { CategoriesResponse } from './dto/categories.response';
import { DisciplinesResponse } from './dto/disciplines.response';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

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
