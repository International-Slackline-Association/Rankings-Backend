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
      categories.year.options[0].label = 'Last 3';
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
    const rankings = await this.rankingsService.queryRankings(20, category, {
      athleteId: dto.athleteId,
      after: dto.next,
      country: dto.country,
    });
    const rankingsWithAthletes = await Promise.all(
      rankings.items.map(async (item, index) => {
        const athlete = await this.athleteService.getAthlete(item.id);
        let currentRank: number;
        // if (dto.athleteId || dto.country) {
        currentRank = await this.rankingsService.getAthleteRankInCategory({ athleteId: item.id, ...category });
        // }
        // currentRank = currentRank === 0 ? null : currentRank ? currentRank + 1 : undefined;
        return { athlete, ranking: item, currentRank: currentRank };
      }),
    );
    return new RankingsListResponse(
      rankingsWithAthletes.map<IRankingsListItem>(obj => {
        let changeInRank = 0;
        if (obj.ranking.rankBeforeLatestContest && obj.currentRank) {
          changeInRank = obj.ranking.rankBeforeLatestContest - obj.currentRank;
        }
        return {
          id: obj.ranking.id,
          age: obj.ranking.age,
          country: obj.ranking.country,
          name: obj.ranking.name,
          points: obj.ranking.points.toString(),
          // tslint:disable-next-line:max-line-length
          rank: dto.athleteId || dto.country ? obj.currentRank : undefined, // let website decide the rank because its sequential
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
