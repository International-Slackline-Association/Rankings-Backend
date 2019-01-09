import { Controller, Get, Param, Req } from '@nestjs/common';

import { CategoriesService } from 'core/category/categories.service';
import { CategoriesResponse } from './dto/categories.response';
import { RankingsService } from './rankings.service';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get('categories')
  public getCategories(): CategoriesResponse {
    const categories = this.categoriesService.getCategories();
    return new CategoriesResponse([
      categories.discipline,
      categories.year,
      categories.gender,
      categories.age,
    ]);
  }
}
