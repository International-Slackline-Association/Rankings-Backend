import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
import { IdGenerator } from 'shared/generators/id.generator';
import { CreateAthleteDto } from './dto/create-athlete.dto';

@Injectable()
export class SubmitAthleteService {
  constructor(private readonly db: DatabaseService) {}
  public async createAthlete(createAthleteDto: CreateAthleteDto) {
    const id = await this.generateValidAthleteId(
      createAthleteDto.name,
      createAthleteDto.surname,
    );
    await this.db.putAthlete({ id, ...createAthleteDto });
    return id;
  }

  private async generateValidAthleteId(name: string, surname: string) {
    let id = IdGenerator.generateAthleteId(name, surname);
    let athlete = await this.db.getAthleteDetails(id);
    let suffix = 1;
    while (athlete) {
      if (suffix > 10) {
        throw new Error(
          'Cannot create athlete id. Name + Surname appears more than 10 times',
        );
      }
      id = IdGenerator.generateAthleteId(name, surname, suffix.toString());
      athlete = await this.db.getAthleteDetails(id);
      suffix++;
    }
    return id;
  }
}
