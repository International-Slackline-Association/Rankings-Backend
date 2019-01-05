import { Utils } from 'shared/utils';

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

  public static stripYearFromContestId(contestId: string): number {
    // example swiss-open_2018, slackline_2019,
    const year = contestId.split('_')[1];
    return parseInt(year, 10);
  }

  /** name-surname + suffix (if collision happens) is a unique human readable entity */
  public static generateAthleteId(
    name: string,
    surname: string,
    suffix?: string,
  ): string {
    // example name_surname, name_surname_1
    name = Utils.normalizeString(name);
    surname = Utils.normalizeString(surname);
    return suffix ? `${name}-${surname}-${suffix}` : `${name}-${surname}`;
  }
}
