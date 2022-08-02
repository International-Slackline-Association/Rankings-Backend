import { Body, Controller, Get, Param, Post, Req, UsePipes } from '@nestjs/common';

import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsService } from 'core/athlete/rankings.service';
import { CategoriesService } from 'core/category/categories.service';
import { Discipline, Year } from 'shared/enums';
import { ContestTypeUtility, DisciplineUtility, YearUtility } from 'shared/enums/enums-utility';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Utils } from 'shared/utils';
import { ContestService } from '../../../core/contest/contest.service';
import { CountryService } from '../country/country.service';
import { AthleteResponse } from './dto/athlete.response';
import { CategoriesResponse } from './dto/categories.response';
import { AthleteContestsDto, athleteContestsDtoSchema } from './dto/contests.dto';
import { AthleteContestsResponse, IAthleteContestItem } from './dto/contests.response';
import { AthleteSuggestionsResponse } from './dto/suggestions.response';

@Controller('athlete')
export class AthleteController {
  constructor(
    private readonly athleteService: AthleteService,
    private readonly rankingsService: RankingsService,
    private readonly categoriesService: CategoriesService,
    private readonly countryService: CountryService,
    private readonly contestService: ContestService,
  ) {}

  @Get('details/:id')
  public async getAthlete(@Param() params): Promise<AthleteResponse> {
    const athlete = await this.athleteService.getAthlete(params.id);
    if (!athlete) {
      return new AthleteResponse(null);
    }
    const countryName = this.countryService.getCountryName(athlete.country);
    const overallRank = await this.rankingsService.getOverallRank(params.id);
    return new AthleteResponse({
      id: athlete.id,
      name: athlete.name,
      surname: athlete.surname,
      age: athlete.age,
      country: countryName || athlete.country,
      profileUrl: athlete.profileUrl,
      infoUrl: athlete.infoUrl,
      overallRank: !Utils.isNil(overallRank) ? (overallRank + 1).toString() : '',
    });
  }

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
    const results = await this.athleteService.queryAthletes(params.name, 5);
    return new AthleteSuggestionsResponse(
      results.items.map(athlete => {
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
    const categories = this.categoriesService.getCategories(true, true);
    categories.discipline.options[0].label = 'All';
    return new CategoriesResponse([categories.discipline, categories.year]);
  }

  @Post('contests')
  @UsePipes(new JoiValidationPipe(athleteContestsDtoSchema))
  public async getContests(@Body() dto: AthleteContestsDto): Promise<AthleteContestsResponse> {
    let categories = dto.selectedCategories || [];
    if (categories.length < 2) {
      categories = [Discipline.Overall, YearUtility.AllYears[0]];
    }
    const discipline = categories[0];
    const year = categories[1];

    let betweenDates;
    if (year) {
      betweenDates = { start: new Date(year, 0), end: new Date(year + 1, 0) };
    }
    const results = await this.athleteService.getContests(dto.id, discipline, 10, betweenDates, dto.next);

    const athletesWithContests = await Promise.all(
      results.items.map(async item => {
        const contest = await this.contestService.getContest(item.contestId, item.contestDiscipline);
        return { contest, item };
      }),
    );
    return new AthleteContestsResponse(
      athletesWithContests.map<IAthleteContestItem>(obj => ({
        id: obj.contest.id,
        contestType: ContestTypeUtility.getNamedContestType(obj.contest.contestType),
        date: Utils.dateToMoment(obj.contest.date).format('DD/MM/YYYY'),
        discipline: DisciplineUtility.getNamedDiscipline(obj.contest.discipline),
        name: obj.contest.name,
        rank: obj.item.place,
        thumbnailUrl: obj.contest.thumbnailUrl || obj.contest.profileUrl,
        points: obj.item.points,
      })),
      results.lastKey,
    );
  }
}
