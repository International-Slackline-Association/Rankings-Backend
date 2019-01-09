import { Injectable } from '@nestjs/common';
import { Utils } from 'shared/utils';
import { CountrySuggestionsResponse } from './dto/country-suggestions.response';

// tslint:disable-next-line:no-var-requires
const countryList = require('country-list');

@Injectable()
export class CountryService {
  constructor() {}

  public getCountrySuggestions(query: string): CountrySuggestionsResponse {
    const lookup = Utils.normalizeString(query);
    if (lookup.length < 3) {
      return new CountrySuggestionsResponse([]);
    }
    const countryNames = countryList.getNames() as string[];
    let names = countryNames.filter(name => name.toLowerCase().indexOf(lookup) !== -1);
    names = names.slice(0, 5);
    const items = names.map(name => {
      return { name: name, code: countryList.getCode(name) };
    });
    return new CountrySuggestionsResponse(items);
  }

  public getCountryName(code): string {
    return countryList.getName(code);
  }
}
