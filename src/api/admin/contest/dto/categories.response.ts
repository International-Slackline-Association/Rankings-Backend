import { ISelectOption } from 'shared/types/shared';

export class CategoriesResponse {
  public readonly categories: ISelectOption[];

  constructor(categories: ISelectOption[]) {
    this.categories = categories;
  }
}
