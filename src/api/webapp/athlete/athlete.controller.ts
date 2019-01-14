import { Body, Controller, Get, Param, Post, Req, UsePipes } from '@nestjs/common';

import { AthleteService } from 'core/athlete/athlete.service';
import { CategoriesService } from 'core/category/categories.service';
import { ContestCategoryUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Utils } from 'shared/utils';
import { ContestService } from '../../../core/contest/contest.service';
import { CountryService } from '../country/country.service';
import { AthleteSuggestionsResponse } from './dto/athlete-suggestions.response';
import { AthleteResponse } from './dto/athlete.response';
import { CategoriesResponse } from './dto/categories.response';
import { AthleteContestsDto, athleteContestsDtoSchema } from './dto/contests.dto';
import { AthleteContestsResponse, IAthleteContestItem } from './dto/contests.response';

@Controller('athlete')
export class AthleteController {
  constructor(
    private readonly athleteService: AthleteService,
    private readonly categoriesService: CategoriesService,
    private readonly countryService: CountryService,
    private readonly contestService: ContestService,
  ) {}

  @Get('suggestions/:name')
  public async getAthleteSuggestions(
    @Param() params,
    @Req() request: Express.Request,
  ): Promise<AthleteSuggestionsResponse> {
    const includeEmails = Utils.isRequestAuthenticated(request);
    const lookup = Utils.normalizeString(params.name);
    if (lookup.length < 3) {
      return new AthleteSuggestionsResponse([]);
    }
    const athletes = await this.athleteService.queryAthletesByName(params.name, 5);
    return new AthleteSuggestionsResponse(
      athletes.map(athlete => {
        return {
          id: athlete.id,
          name: athlete.name,
          surname: athlete.surname,
          email: includeEmails ? athlete.email : undefined,
        };
      }),
    );
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

    const athletesWithContests = await Promise.all(
      results.items.map(async item => {
        const contest = await this.contestService.getContest(item.contestId, item.contestDiscipline);
        return { contest, item };
      }),
    );
    return new AthleteContestsResponse(
      athletesWithContests.map<IAthleteContestItem>(obj => ({
        id: obj.contest.id,
        contestCategory: ContestCategoryUtility.getNamedContestCategory(obj.contest.contestCategory),
        date: Utils.dateToMoment(obj.contest.date).format('DD/MM/YYYY'),
        discipline: DisciplineUtility.getNamedDiscipline(obj.contest.discipline),
        name: obj.contest.name,
        rank: obj.item.place,
        smallProfileUrl: obj.contest.profileUrl,
      })),
      results.lastKey,
    );
  }
}
