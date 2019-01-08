export interface IAthleteSuggestionsResponseItem {
  id: string;
  name: string;
  surname: string;
  email?: string;
}

export class AthleteSuggestionsResponse {
  public readonly items: IAthleteSuggestionsResponseItem[];

  constructor(items: IAthleteSuggestionsResponseItem[]) {
    this.items = items;
  }
}
