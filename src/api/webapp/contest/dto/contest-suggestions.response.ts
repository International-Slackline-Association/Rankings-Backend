import { INamedDiscipline } from 'shared/types/shared';

export interface IContestSuggestionsResponseItem {
  id: string;
  name: string;
  discipline: INamedDiscipline;
}

export class ContestSuggestionsResponse {
  public readonly items: IContestSuggestionsResponseItem[];

  constructor(items: IContestSuggestionsResponseItem[]) {
    this.items = items;
  }
}
