import { Controller, Get, Param, Req } from '@nestjs/common';
import { Utils } from 'shared/utils';
import { AthleteService } from './athlete.service';
import { AthleteResponse } from './dto/athlete.response';

@Controller('athlete')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Get(':id')
  public async getAthlete(@Param() params): Promise<AthleteResponse> {
    const athleteDetail = await this.athleteService.getAthlete(params.id);
    const { createdAt, thumbnailUrl, ...rest } = athleteDetail;
    return new AthleteResponse({ ...rest, birthdate: athleteDetail.birthdate.toISODate() });
  }
}
