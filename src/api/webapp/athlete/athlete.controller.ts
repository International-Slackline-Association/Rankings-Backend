import { Body, Controller, Get, Param, Post, Req, UsePipes } from '@nestjs/common';

import { CategoriesService } from 'core/category/categories.service';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Utils } from 'shared/utils';
import { CountryService } from '../country/country.service';
import { AthleteService } from './athlete.service';
import { AthleteSuggestionsResponse } from './dto/athlete-suggestions.response';
import { AthleteResponse } from './dto/athlete.response';
import { CategoriesResponse } from './dto/categories.response';
import { AthleteContestsDto, athleteContestsDtoSchema } from './dto/contests.dto';

@Controller('athlete')
export class AthleteController {
  constructor(
    private readonly athleteService: AthleteService,
    private readonly categoriesService: CategoriesService,
    private readonly countryService: CountryService,
  ) {}

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

  @Get(':id')
  public async getAthlete(@Param() params): Promise<AthleteResponse> {
    const athlete = await this.athleteService.getAthlete(params.id);
    if (!athlete) {
      return new AthleteResponse(null);
    }
    const countryName = this.countryService.getCountryName(athlete.country);
    const overallRank = await this.athleteService.getOverallRank(params.id);
    return new AthleteResponse({
      id: athlete.id,
      name: athlete.name,
      surname: athlete.surname,
      age: athlete.age,
      country: countryName,
      profileUrl: athlete.profileUrl,
      infoUrl: athlete.infoUrl,
      overallRank: overallRank ? overallRank.toString() : '-',
    });
  }

  @Post('contests')
  @UsePipes(new JoiValidationPipe(athleteContestsDtoSchema))
  public async getContests(@Body() dto: AthleteContestsDto): Promise<any> {
    const results = await this.athleteService.getContests(dto.id, dto.year, dto.discipline, dto.next);
    return results;
  }
}
