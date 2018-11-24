import { normalizeStringForSearching } from 'shared/utils';

export class IdGenerator {
  /** contestName + year is a unique human readable entity */
  public static generateContestId(name: string, year: number): string {
    // example swiss-open_2018, slackline_2019,
    const dashedName = name
      .split(' ')
      .join('-')
      .toLowerCase();
    const id = `${dashedName}_${year}`;
    return id;
  }

  /** name-surname + suffix (if collision happens) is a unique human readable entity */
  public static generateAthleteId(
    name: string,
    surname: string,
    suffix?: string,
  ): string {
    // example name_surname, name_surname_1
    name = normalizeStringForSearching(name);
    surname = normalizeStringForSearching(surname);
    return suffix ? `${name}-${surname}-${suffix}` : `${name}-${surname}`;
  }
}
