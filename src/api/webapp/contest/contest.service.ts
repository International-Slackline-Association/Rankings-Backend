import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
import { DisciplineUtility } from 'shared/enums-utility';
import { Utils } from 'shared/utils';
import { ContestSuggestionsResponse } from './dto/contest-suggestions.response';

@Injectable()
export class ContestService {
  constructor(private readonly db: DatabaseService) {}

  public async getContestSuggestions(query: string): Promise<ContestSuggestionsResponse> {
    const lookup = Utils.normalizeString(query);
    if (lookup.length < 3) {
      return new ContestSuggestionsResponse([]);
    }
    const contests = await this.db.queryContestsByName(lookup, 5);
    return new ContestSuggestionsResponse(
      contests.map(contest => {
        return {
          id: contest.id,
          name: contest.name,
          discipline: { id: contest.discipline, name: DisciplineUtility.getName(contest.discipline) },
        };
      }),
    );
  }
}
