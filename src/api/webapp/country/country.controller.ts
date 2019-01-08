import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountrySuggestionsResponse } from './dto/country-suggestions.response';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get('suggestions/:name')
  public getCountrySuggestions(@Param() params): CountrySuggestionsResponse {
    return this.countryService.getCountrySuggestions(params.name);
  }
}
