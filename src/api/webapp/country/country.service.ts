import { Injectable } from '@nestjs/common';
import { Utils } from 'shared/utils';
import { CountrySuggestionsResponse } from './dto/country-suggestions.response';

// tslint:disable-next-line:no-var-requires
const countryLookup = require('country-code-lookup');

@Injectable()
export class CountryService {
  constructor() {}

  public getCountrySuggestions(query: string): CountrySuggestionsResponse {
    const lookup = Utils.normalizeString(query);
    if (lookup.length < 3) {
      return new CountrySuggestionsResponse([]);
    }
    let countries = countryLookup.countries as {
      country: string;
      iso2: string;
    }[];
    countries = countries.filter(c => c.country.toLowerCase().indexOf(lookup) !== -1);
    countries = countries.slice(0, 5);
    const items = countries.map(c => {
      return { name: c.country, code: c.iso2 };
    });
    return new CountrySuggestionsResponse(items);
  }

  public getCountryName(code: string): string {
    if (code.toUpperCase() === 'TW') {
      return 'Chinese Taipei';
    }
    return countryLookup.byIso(code).country;
  }
}
