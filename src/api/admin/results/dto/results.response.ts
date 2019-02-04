import { INamedContestType, INamedDiscipline } from 'shared/types/shared';

export interface IResultsResponseItem {
  readonly id: string;
  readonly place: number;
  readonly name: string;
  readonly surname: string;
  readonly points: number;
}

export class ResultsResponse {
  public readonly items: IResultsResponseItem[];

  constructor(items: IResultsResponseItem[]) {
    this.items = items;
  }
}
