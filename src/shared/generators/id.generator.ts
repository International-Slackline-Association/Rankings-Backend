import { APIErrors } from 'shared/exceptions/api.exceptions';
import { Utils } from 'shared/utils';

export class IdGenerator {
  /** contestName + year is a unique human readable entity */
  public static generateContestId(name: string, year: number): string {
    // example swiss-open_2018, slackline_2019,
    const urlName = this.replaceUnsafeUrlCharacters(name);
    const dashedName = Utils.normalizeString(urlName)
      .split(' ')
      .join('-');
    const id = `${dashedName}_${year}`;
    return id;
  }

  /** name-surname + suffix (if collision happens) is a unique human readable entity */
  public static generateAthleteId(name: string, surname: string, suffix?: string): string {
    // example name_surname, name_surname_1
    const urlName = this.replaceUnsafeUrlCharacters(name);
    const n = Utils.normalizeString(urlName)
      .split(' ')
      .join('-');

    const urlSurname = this.replaceUnsafeUrlCharacters(surname);
    const s = Utils.normalizeString(urlSurname)
      .split(' ')
      .join('-');
    const id = suffix ? `${n}-${s}_${suffix}` : `${n}-${s}`;
    return id;
  }

  private static replaceUnsafeUrlCharacters(str: string) {
    const fixed = str.replace(/[^a-zA-Z0-9-_]/g, ' ');
    const spacesCleaned = fixed.replace(/\s\s+/g, ' ');
    return spacesCleaned;
  }
}
