import { Controller, Get, Param, Req } from '@nestjs/common';
import { CategoriesService } from 'core/category/categories.service';
import { Utils } from 'shared/utils';
import { AthleteService } from './athlete.service';
import { AthleteSuggestionsResponse } from './dto/athlete-suggestions.response';
import { CategoriesResponse } from './dto/categories.response';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService, private readonly categoriesService: CategoriesService) {}

  @Get('suggestions/:name')
  public async getAthleteSuggestions(
    @Param() params,
    @Req() request: Express.Request,
  ): Promise<AthleteSuggestionsResponse> {
    const includeEmails = Utils.isRequestAuthenticated(request);
    return this.athleteService.getAthleteSuggestions(params.name, includeEmails);
  }

  @Get('categories')
  public getCategories(): CategoriesResponse {
    const categories = this.categoriesService.getCategories(false);
    return new CategoriesResponse([categories.discipline, categories.year]);
  }
}
