import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ContestResultsDto, contestResultsDtoSchema } from 'api/webapp/contest/dto/results.dto';
import { AthleteService } from 'core/athlete/athlete.service';
import { ContestService } from 'core/contest/contest.service';
import { Discipline } from 'shared/enums';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { IResultsResponseItem, ResultsResponse } from './dto/results.response';

@Controller('results')
export class ResultsController {
  constructor(private readonly athleteService: AthleteService, private readonly contestService: ContestService) {}

  @Get(':id/:discipline')
  public async getResults(
    @Param('id') id: string,
    @Param('discipline', new ParseIntPipe())
    discipline: Discipline,
  ): Promise<ResultsResponse> {
    const results = await this.contestService.getResults(id, discipline, undefined);
    const athletesWithPlaces = await Promise.all(
      results.items.map(async item => {
        const athlete = await this.athleteService.getAthlete(item.athleteId);
        return { athlete, item };
      }),
    );
    return new ResultsResponse(
      athletesWithPlaces.map<IResultsResponseItem>(obj => ({
        id: obj.athlete.id,
        name: obj.athlete.name,
        place: obj.item.place,
        points: obj.item.points,
        surname: obj.athlete.surname,
      })),
    );
  }
}
