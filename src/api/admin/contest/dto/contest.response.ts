import { INamedContestType, INamedDiscipline } from 'shared/types/shared';

export interface IContestResponseItem {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly city: string;
  readonly country: string;
  readonly discipline: INamedDiscipline;
  readonly contestType: INamedContestType;
  readonly prize: number;
  readonly profileUrl: string;
  readonly infoUrl: string;
}

export class ContestResponse {
  public readonly contest: IContestResponseItem;

  constructor(contest: IContestResponseItem) {
    this.contest = contest;
  }
}
