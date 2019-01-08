import { Controller, Get, Param, Req } from '@nestjs/common';
import { Utils } from 'shared/utils';
import { ContestService } from './contest.service';
import { ContestSuggestionsResponse } from './dto/contest-suggestions.response';

@Controller('contest')
export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  @Get('suggestions/:name')
  public async getContestSuggestions(
    @Param() params,
    @Req() request: Express.Request,
  ): Promise<ContestSuggestionsResponse> {
    return this.contestService.getContestSuggestions(params.name);
  }
}
