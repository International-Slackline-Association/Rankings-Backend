import { INamedDiscipline, INameIdEntity } from 'shared/types/shared';

export interface IContestSuggestionsResponseItem {
  id: string;
  name: string;
  discipline: INamedDiscipline;
  year: number;
  gender: INameIdEntity;
}

export class ContestSuggestionsResponse {
  public readonly items: IContestSuggestionsResponseItem[];

  constructor(items: IContestSuggestionsResponseItem[]) {
    this.items = items;
  }
}
