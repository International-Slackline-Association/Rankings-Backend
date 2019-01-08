import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DatabaseService } from 'core/database/database.service';
import { Utils } from 'shared/utils';
import { AthleteResponse } from './dto/athlete.response';

@Injectable()
export class AthleteService {
  constructor(private readonly db: DatabaseService) {}

  public async getAthlete(id: string): Promise<AthleteDetail> {
    const athlete = await this.db.getAthleteDetails(id);
    return athlete;
  }
}
