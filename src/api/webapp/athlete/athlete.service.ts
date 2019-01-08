import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
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
}
