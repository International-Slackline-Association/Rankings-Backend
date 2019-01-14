import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';

import { AthleteService } from 'core/athlete/athlete.service';
import { RankingsCategory } from 'core/athlete/interfaces/rankings.interface';
import { RankingsService } from 'core/athlete/rankings.service';
import { CategoriesService } from 'core/category/categories.service';
import { AgeCategory, Discipline, Gender } from 'shared/enums';
import { YearUtility } from 'shared/enums/enums-utility';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
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

  @Get('categories')
  public getCategories(): CategoriesResponse {
    const categories = this.categoriesService.getCategories();
    return new CategoriesResponse([categories.discipline, categories.year, categories.gender, categories.age]);
  }

  @Post('list')
  @UsePipes(new JoiValidationPipe(rankingsListDtoSchema))
  public async getRankingsList(@Body() dto: RankingsListDto): Promise<RankingsListResponse> {
    let categories = dto.selectedCategories || [];
    if (categories.length < 4) {
      categories = [Discipline.Overall, YearUtility.Current, Gender.All, AgeCategory.All];
    }
    const discipline = categories[0];
    const year = categories[1];
    const gender = categories[2];
    const ageCategory = categories[3];

    const category: RankingsCategory = { discipline, year, gender, ageCategory };
    const rankings = await this.rankingsService.queryRankings(10, category, {
      athleteId: dto.athleteId,
      after: dto.next,
      country: dto.country,
    });
    const rankingsWithAthletes = await Promise.all(
      rankings.items.map(async (item, index) => {
        const athlete = await this.athleteService.getAthlete(item.id);
        let place = index;
        if (dto.athleteId || dto.country) {
          place = await this.rankingsService.getAthleteRankInCategory({ athleteId: item.id, ...category });
          console.log('place: ', place);
        }
        return { athlete, ranking: item, place };
      }),
    );
    return new RankingsListResponse(
      rankingsWithAthletes.map<IRankingsListItem>(obj => {
        return {
          id: obj.ranking.id,
          age: obj.ranking.age,
          country: obj.ranking.country,
          name: obj.ranking.name,
          points: obj.ranking.points.toString(),
          rank: obj.place + 1,
          smallProfileUrl: obj.athlete.profileUrl,
          surname: obj.ranking.surname,
        };
      }),
      rankings.lastKey,
    );
  }
}
