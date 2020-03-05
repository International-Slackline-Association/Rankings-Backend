import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { RankingsService } from 'core/athlete/rankings.service';
import { DatabaseService } from 'core/database/database.service';
import { APIErrors } from 'shared/exceptions/api.exceptions';
import { IdGenerator } from 'shared/generators/id.generator';
import { SubmitAthleteDto } from './dto/submit-athlete.dto';

@Injectable()
export class SubmitAthleteService {
  constructor(private readonly db: DatabaseService, private readonly rankingsService: RankingsService) {}
  public async createAthlete(dto: SubmitAthleteDto) {
    await this.checkDuplicate(dto.name, dto.surname, dto.email);
    const id = await this.generateValidAthleteId(dto.name, dto.surname);
    const athleteDetail = new AthleteDetail({
      ...dto,
      id: id,
      birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
    });
    await this.db.putAthlete(athleteDetail);
    return id;
  }

  public async modifyAthlete(dto: SubmitAthleteDto) {
    const current = await this.db.getAthleteDetails(dto.id);
    const athleteDetail = new AthleteDetail({
      ...dto,
      birthdate: dto.birthdate ? new Date(dto.birthdate) : undefined,
    });
    await this.db.putAthlete(athleteDetail);
    if (this.shouldRefreshRankings(current, athleteDetail)) {
      await this.rankingsService.refreshAllRankingsOfAthlete(dto.id);
    }
    return dto.id;
  }

  private shouldRefreshRankings(oldAthlete: AthleteDetail, modifiedAthlete: AthleteDetail) {
    if (oldAthlete.gender !== modifiedAthlete.gender) {
      return true;
    }
    if (oldAthlete.country !== modifiedAthlete.country) {
      return true;
    }
    if (oldAthlete.name !== modifiedAthlete.name) {
      return true;
    }
    if (oldAthlete.surname !== modifiedAthlete.surname) {
      return true;
    }
    if (oldAthlete.birthdate !== modifiedAthlete.birthdate) {
      return true;
    }
    return false;
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
