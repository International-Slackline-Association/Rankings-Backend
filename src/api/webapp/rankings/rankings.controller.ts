import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';

import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsCategory } from 'core/athlete/interfaces/rankings.interface';
import { RankingsService } from 'core/athlete/rankings.service';
import { CategoriesService } from 'core/category/categories.service';
import { AgeCategory, Discipline, Gender, RankingType } from 'shared/enums';
import { YearUtility } from 'shared/enums/enums-utility';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Utils } from '../../../shared/utils';
import { CategoriesDto } from './dto/categories.dto';
import { CategoriesResponse } from './dto/categories.response';
import { RankingsListDto, rankingsListDtoSchema } from './dto/rankings-list.dto';
import { IRankingsListItem, RankingsListResponse } from './dto/rankings-list.response';

@Controller('rankings')
export class RankingsController {
  constructor(
    private readonly rankingsService: RankingsService,
    private readonly categoriesService: CategoriesService,
    private readonly athleteService: AthleteService,
  ) {}
  private defaultCategories = [
    RankingType.TopScore,
    Discipline.Overall,
    YearUtility.AllYears[0],
    Gender.All,
    AgeCategory.All,
  ];

  @Post('categories')
  public getCategories(@Body() dto: CategoriesDto): CategoriesResponse {
    let selectedCategories = dto.selectedCategories || [];
    if (selectedCategories.length < 5) {
      selectedCategories = this.defaultCategories;
    }
    const rankingType = selectedCategories[0];
    const categories = this.categoriesService.getCategories();
    if (rankingType === RankingType.TopScore) {
      categories.year.options[0].label = 'Last 2';
    }
    return new CategoriesResponse([
      categories.rankingType,
      categories.discipline,
      categories.year,
      categories.gender,
      categories.age,
    ]);
  }

  @Post('list')
  @UsePipes(new JoiValidationPipe(rankingsListDtoSchema))
  public async getRankingsList(@Body() dto: RankingsListDto): Promise<RankingsListResponse> {
    let categories = dto.selectedCategories || [];
    if (categories.length < 5) {
      categories = this.defaultCategories;
    }
    const rankingType = categories[0];
    const discipline = categories[1];
    const year = categories[2];
    const gender = categories[3];
    const ageCategory = categories[4];

    const category: RankingsCategory = { rankingType, discipline, year, gender, ageCategory };
    const rankings = await this.rankingsService.queryRankings(10, category, {
      athleteId: dto.athleteId,
      after: dto.next,
      country: dto.country,
    });
    const rankingsWithAthletes = await Promise.all(
      rankings.items.map(async (item, index) => {
        const athlete = await this.athleteService.getAthlete(item.id);
        let place;
        if (dto.athleteId || dto.country) {
          place = await this.rankingsService.getAthleteRankInCategory({ athleteId: item.id, ...category });
        }
        place = place === 0 ? null : place ? place + 1 : undefined;
        return { athlete, ranking: item, place: place };
      }),
    );
    return new RankingsListResponse(
      rankingsWithAthletes.map<IRankingsListItem>(obj => {
        // If change in rank longer than 6 months dont count it.
        const changeInRank = obj.ranking.changeInRank
          ? Utils.DateNow().diff(obj.ranking.changeInRankUpdatedAt, 'months') < 6
            ? obj.ranking.changeInRank
            : 0
          : 0;

        return {
          id: obj.ranking.id,
          age: obj.ranking.age,
          country: obj.ranking.country,
          name: obj.ranking.name,
          points: obj.ranking.points.toString(),
          rank: obj.place,
          thumbnailUrl: obj.athlete.thumbnailUrl || obj.athlete.profileUrl,
          surname: obj.ranking.surname,
          contestCount: obj.ranking.contestCount,
          changeInRank: changeInRank,
        };
      }),
      rankings.lastKey,
    );
  }
}
