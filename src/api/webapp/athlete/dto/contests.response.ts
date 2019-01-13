import { INamedContestCategory, INamedDiscipline } from 'shared/types/shared';

export interface IAthleteContestItem {
  readonly id: string;
  readonly name: string;
  readonly rank: number;
  readonly contestCategory: INamedContestCategory;
  readonly date: number;
  readonly discipline: INamedDiscipline;
  readonly smallProfileUrl: string;
}

export class AthleteContestsResponse {
  public readonly items: IAthleteContestItem[];
  public readonly next: any;

  constructor(items: IAthleteContestItem[], next: any) {
    this.items = items;
    this.next = next;
  }
}
