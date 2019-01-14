import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UsePipes } from '@nestjs/common';

import { AthleteService } from 'core/athlete/athlete.service';
import { CategoriesService } from 'core/category/categories.service';
import { ContestService } from 'core/contest/contest.service';
import { Discipline } from 'shared/enums';
import { ContestCategoryUtility, DisciplineUtility } from 'shared/enums/enums-utility';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Utils } from 'shared/utils';
import { CategoriesResponse } from './dto/categories.response';
import { ContestListDto, contestListDtoSchema } from './dto/contest-list.dto';
import { ContestListResponse, IContestListItem } from './dto/contest-list.response';
import { ContestResponse } from './dto/contest.response';
import { ContestResultsDto, contestResultsDtoSchema } from './dto/results.dto';
import { IContestResultItem, ResultsResponse } from './dto/results.response';
import { ContestSuggestionsDto, contestSuggestionsDtoSchema } from './dto/suggestions.dto';
import { ContestSuggestionsResponse } from './dto/suggestions.response';

@Controller('contest')
export class ContestController {
  constructor(
    private readonly contestService: ContestService,
    private readonly categoriesService: CategoriesService,
    private readonly athleteService: AthleteService,
  ) {}

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
      discipline: DisciplineUtility.getNamedDiscipline(contest.discipline),
      contestCategory: ContestCategoryUtility.getNamedContestCategory(contest.contestCategory),
      country: contest.country,
      date: Utils.dateToMoment(contest.date).format('DD/MM/YYYY'),
      infoUrl: contest.infoUrl,
      name: contest.name,
      prize: contest.prize.toString(),
      profileUrl: contest.profileUrl,
    });
  }

  @Post('list')
  @UsePipes(new JoiValidationPipe(contestListDtoSchema))
  public async getContestList(@Body() dto: ContestListDto): Promise<ContestListResponse> {
    const discipline = dto.selectedCategories[0];
    const year = dto.selectedCategories[1];

    const contests = await this.contestService.queryContests(10, {
      year: year,
      contestId: dto.contestId,
      after: dto.next,
      discipline: discipline,
    });
    return new ContestListResponse(
      contests.items.map<IContestListItem>(contest => {
        return {
          id: contest.id,
          name: contest.name,
          discipline: DisciplineUtility.getNamedDiscipline(contest.discipline),
          year: contest.year,
          prize: contest.prize.toString(),
          contestCategory: ContestCategoryUtility.getNamedContestCategory(contest.contestCategory),
          smallProfileUrl: contest.profileUrl,
          date: Utils.dateToMoment(contest.date).format('DD/MM/YYYY'),
        };
      }),
      contests.lastKey,
    );
  }

  @Post('suggestions')
  @UsePipes(new JoiValidationPipe(contestSuggestionsDtoSchema))
  public async getContestSuggestions(@Body() dto: ContestSuggestionsDto): Promise<ContestSuggestionsResponse> {
    const lookup = Utils.normalizeString(dto.query);
    if (lookup.length < 3) {
      return new ContestSuggestionsResponse([]);
    }
    const contests = await this.contestService.queryContests(5, {
      year: dto.year,
      discipline: dto.discipline,
      name: dto.query,
    });
    return new ContestSuggestionsResponse(
      contests.items.map(contest => {
        return {
          id: contest.id,
          name: contest.name,
          discipline: DisciplineUtility.getNamedDiscipline(contest.discipline),
          year: contest.year,
        };
      }),
    );
  }

  @Get('categories')
  public getCategories(): CategoriesResponse {
    const categories = this.categoriesService.getCategories(false);
    categories.discipline.options[0].label = 'All';
    return new CategoriesResponse([categories.discipline, categories.year]);
  }

  @Post('results/:id/:discipline')
  public async getResults(
    @Param('id') id: string,
    @Param('discipline', new ParseIntPipe())
    discipline: Discipline,
    @Body(new JoiValidationPipe(contestResultsDtoSchema))
    dto: ContestResultsDto,
  ): Promise<ResultsResponse> {
    const results = await this.contestService.getResults(id, discipline, 10, dto.next);
    const athletesWithPlaces = await Promise.all(
      results.items.map(async item => {
        const athlete = await this.athleteService.getAthlete(item.athleteId);
        return { athlete, item };
      }),
    );
    return new ResultsResponse(
      athletesWithPlaces.map<IContestResultItem>(obj => ({
        id: obj.athlete.id,
        age: obj.athlete.age,
        name: obj.athlete.name,
        points: obj.item.points,
        country: obj.athlete.country,
        rank: obj.item.place,
        surname: obj.athlete.surname,
        thumbnailUrl: obj.athlete.thumbnailUrl,
      })),
      results.lastKey,
    );
  }
}
