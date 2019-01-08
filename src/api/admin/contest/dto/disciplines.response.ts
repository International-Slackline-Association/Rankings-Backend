import { ISelectOption } from 'shared/types/shared';

export class DisciplinesResponse {
  public readonly disciplines: ISelectOption[];

  constructor(disciplines: ISelectOption[]) {
    this.disciplines = disciplines;
  }
}
