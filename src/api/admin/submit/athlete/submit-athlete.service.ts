import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DatabaseService } from 'core/database/database.service';
import { APIErrors } from 'shared/exceptions/api.exceptions';
import { IdGenerator } from 'shared/generators/id.generator';
import { SubmitAthleteDto } from './dto/submit-athlete.dto';

@Injectable()
export class SubmitAthleteService {
  constructor(private readonly db: DatabaseService) {}
  public async createAthlete(dto: SubmitAthleteDto) {
    await this.checkDuplicate(dto.name, dto.surname, dto.email);
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
    return this.db.updateAthleteProfileUrl(athleteId, url);
  }

  private async checkDuplicate(name: string, surname: string, email: string) {
    const id = IdGenerator.generateAthleteId(name, surname);
    const athlete = await this.db.getAthleteDetails(id);
    if (athlete) {
      if (athlete.email === email) {
        throw new APIErrors.DuplicateAthleteError(email);
      }
    }
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
