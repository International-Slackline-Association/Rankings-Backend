import { INamedContestType, INamedDiscipline, INameIdEntity } from 'shared/types/shared';

export interface IContestListItem {
  readonly id: string;
  readonly name: string;
  readonly prize: string;
  readonly contestType: INamedContestType;
  readonly contestGender: INameIdEntity;
  readonly date: string;
  readonly discipline: INamedDiscipline;
  readonly thumbnailUrl: string;
  readonly country: string;
  readonly resultsAvailable: boolean;
}

export class ContestListResponse {
  public readonly items: IContestListItem[];
  public readonly next: any;

  constructor(items: IContestListItem[], next: any) {
    this.items = items;
    this.next = next;
  }
}
