import { Controller, Get, Param, Req } from '@nestjs/common';
import { CategoriesService } from 'core/category/categories.service';
import { Utils } from 'shared/utils';
import { ContestService } from './contest.service';
import { CategoriesResponse } from './dto/categories.response';
import { ContestSuggestionsResponse } from './dto/contest-suggestions.response';

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
}
