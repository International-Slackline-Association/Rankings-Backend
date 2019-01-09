import { Injectable } from '@nestjs/common';

import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { DatabaseService } from 'core/database/database.service';
import { AgeCategory, Discipline, Gender, Year } from 'shared/enums';
import { Utils } from 'shared/utils';
import { AthleteSuggestionsResponse } from './dto/athlete-suggestions.response';

@Injectable()
export class AthleteService {
  constructor(private readonly db: DatabaseService) {}

  public async getAthleteSuggestions(query: string, includeEmail: boolean): Promise<AthleteSuggestionsResponse> {
    const lookup = Utils.normalizeString(query);
    if (lookup.length < 3) {
      return new AthleteSuggestionsResponse([]);
    }
    const athletes = await this.db.queryAthletesByName(lookup, 5);
    return new AthleteSuggestionsResponse(
      athletes.map(athlete => {
        return {
          id: athlete.id,
          name: athlete.name,
          surname: athlete.surname,
          email: includeEmail ? athlete.email : undefined,
        };
      }),
    );
  }

  public async getAthlete(id: string): Promise<AthleteDetail> {
    const athlete = await this.db.getAthleteDetails(id);
    return athlete;
  }
  public async getOverallRank(id: string) {
    const pk = {
      ageCategory: AgeCategory.All,
      athleteId: id,
      discipline: Discipline.Overall,
      gender: Gender.All,
      year: Year.All,
    };
    const place = await this.db.getAthleteRankingPlace(pk);
    return place;
  }
}
