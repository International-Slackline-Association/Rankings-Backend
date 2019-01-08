export class CountrySuggestionsResponse {
  public readonly items: { code: string; name: string }[];

  constructor(items: { code: string; name: string }[]) {
    this.items = items;
  }
}
