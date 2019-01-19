import { INamedContestType, INamedDiscipline } from 'shared/types/shared';

export interface IAthleteContestItem {
  readonly id: string;
  readonly name: string;
  readonly rank: number;
  readonly contestType: INamedContestType;
  readonly date: string;
  readonly discipline: INamedDiscipline;
  readonly thumbnailUrl: string;
}

export class AthleteContestsResponse {
  public readonly items: IAthleteContestItem[];
  public readonly next: any;

  constructor(items: IAthleteContestItem[], next: any) {
    this.items = items;
    this.next = next;
  }
}
