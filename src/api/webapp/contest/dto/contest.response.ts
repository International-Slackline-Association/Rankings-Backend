import { INamedContestCategory, INamedDiscipline } from 'shared/types/shared';

export interface IContestResponseItem {
  readonly id: string;
  readonly name: string;
  readonly prize: string;
  readonly contestCategory: INamedContestCategory;
  readonly date: string;
  readonly city: string;
  readonly country: string;
  readonly discipline: INamedDiscipline;
  readonly profileUrl: string;
  readonly infoUrl: string;
}

export class ContestResponse {
  public readonly contest: IContestResponseItem;

  constructor(contest: IContestResponseItem) {
    this.contest = contest;
  }
}
