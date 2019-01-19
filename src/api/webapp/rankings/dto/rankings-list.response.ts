export interface IRankingsListItem {
  readonly id: string;
  readonly rank: number;
  readonly name: string;
  readonly surname: string;
  readonly age: number;
  readonly country: string;
  readonly points: string;
  readonly thumbnailUrl: string;
}

export class RankingsListResponse {
  public readonly items: IRankingsListItem[];
  public readonly next: any;

  constructor(items: IRankingsListItem[], next: any) {
    this.items = items;
    this.next = next;
  }
}
