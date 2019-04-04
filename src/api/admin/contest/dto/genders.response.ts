import { ISelectOption } from 'shared/types/shared';

export class GendersResponse {
  public readonly genders: ISelectOption[];

  constructor(genders: ISelectOption[]) {
    this.genders = genders;
  }
}
