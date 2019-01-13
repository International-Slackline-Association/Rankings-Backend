export interface IContestResultItem {
  readonly id: string;
  readonly rank: number;
  readonly name: string;
  readonly surname: string;
  readonly age: number;
  readonly country: string;
  readonly points: number;
  readonly thumbnailUrl: string;
}

export class ResultsResponse {
  public readonly items: IContestResultItem[];
  public readonly next: any;

  constructor(items: IContestResultItem[], next: any) {
    this.items = items;
    this.next = next;
  }
}
