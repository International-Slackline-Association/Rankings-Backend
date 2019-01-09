import { ICategoryItem } from 'shared/types/shared';

export class CategoriesResponse {
  public readonly items: ICategoryItem[];

  constructor(items: ICategoryItem[]) {
    this.items = items;
  }
}
