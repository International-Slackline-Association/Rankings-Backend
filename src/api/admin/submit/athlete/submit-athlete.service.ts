import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DatabaseService } from 'core/database/database.service';
import { IdGenerator } from 'shared/generators/id.generator';
import { SubmitAthleteDto } from './dto/submit-athlete.dto';

@Injectable()
export class SubmitAthleteService {
  constructor(private readonly db: DatabaseService) {}
  public async createAthlete(dto: SubmitAthleteDto) {
    const id = await this.generateValidAthleteId(dto.name, dto.surname);
    const athleteDetail = new AthleteDetail({
      ...dto,
      id: id,
      birthdate: new Date(dto.birthdate),
    });
    await this.db.putAthlete(athleteDetail);
    return id;
  }

  public async modifyAthlete(dto: SubmitAthleteDto) {
    const athleteDetail = new AthleteDetail({
      ...dto,
      birthdate: new Date(dto.birthdate),
    });
    await this.db.putAthlete(athleteDetail);
    return dto.id;
  }

  public async updateAthleteProfileUrl(athleteId: string, url: string) {
    return this.db.updateAthleteUrl(athleteId, url);
  }

  private async generateValidAthleteId(name: string, surname: string) {
    let id = IdGenerator.generateAthleteId(name, surname);
    let exists = await this.db.isAthleteExists(id);
    let suffix = 1;
    while (exists) {
      if (suffix > 10) {
        throw new Error('Cannot create athlete id. Name + Surname appears more than 10 times');
      }
      id = IdGenerator.generateAthleteId(name, surname, suffix.toString());
      exists = await this.db.isAthleteExists(id);
      suffix++;
    }
    return id;
  }
}
