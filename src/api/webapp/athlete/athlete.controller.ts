import { Controller, Get, Param, Req } from '@nestjs/common';
import { Utils } from 'shared/utils';
import { AthleteService } from './athlete.service';
import { AthleteSuggestionsResponse } from './dto/athlete-suggestions.response';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Get('suggestions/:name')
  public async getAthleteSuggestions(
    @Param() params,
    @Req() request: Express.Request,
  ): Promise<AthleteSuggestionsResponse> {
    const includeEmails = Utils.isRequestAuthenticated(request);
    return this.athleteService.getAthleteSuggestions(params.name, includeEmails);
  }
}
