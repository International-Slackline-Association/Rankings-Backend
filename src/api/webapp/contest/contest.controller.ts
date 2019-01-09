import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';

import { CategoriesService } from 'core/category/categories.service';
import { Discipline } from 'shared/enums';
import { ContestCategoryUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { Utils } from 'shared/utils';
import { ContestService } from './contest.service';
import { CategoriesResponse } from './dto/categories.response';
import { ContestSuggestionsResponse } from './dto/contest-suggestions.response';
import { ContestResponse } from './dto/contest.response';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService, private readonly categoriesService: CategoriesService) {}

  @Get('suggestions/:name')
  public async getContestSuggestions(
    @Param() params,
    @Req() request: Express.Request,
  ): Promise<ContestSuggestionsResponse> {
    return this.contestService.getContestSuggestions(params.name);
  }

  @Get('categories')
  public getCategories(): CategoriesResponse {
    const categories = this.categoriesService.getCategories(false);
    categories.discipline.options[0].label = 'All';
    return new CategoriesResponse([categories.discipline, categories.year]);
  }

  @Get(':id/:discipline')
  public async getContest(
    @Param('id') id: string,
    @Param('discipline', new ParseIntPipe())
    discipline: Discipline,
  ): Promise<ContestResponse> {
    const contest = await this.contestService.getContest(id, discipline);
    if (!contest) {
      return new ContestResponse(null);
    }
    const {} = contest;
    return new ContestResponse({
      id: contest.id,
      city: contest.city,
      discipline: { id: contest.discipline, name: DisciplineUtility.getName(contest.discipline) },
      contestCategory: { id: contest.contestCategory, name: ContestCategoryUtility.getName(contest.contestCategory) },
      country: contest.country,
      date: Utils.dateToMoment(contest.date).format('DD/MM/YYYY'),
      infoUrl: contest.infoUrl,
      name: contest.name,
      prize: contest.prize.toString(),
      profileUrl: contest.profileUrl,
    });
  }
}
