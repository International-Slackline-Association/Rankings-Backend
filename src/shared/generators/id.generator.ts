import * as crypto from 'crypto';
import { Utils } from 'shared/utils';

export class IdGenerator {
  public static generateContestId(): string {
    return this.generateRandomId();
  }

  // Random 6 hex characters generator
  private static generateRandomId(): string {
    const result = crypto.randomBytes(3).toString('hex');
    return result;
  }

  /** name-surname + suffix (if collision happens) is a unique human readable entity */
  public static generateAthleteId(name: string, surname: string, suffix?: string): string {
    // example name_surname, name_surname_1
    const urlName = this.replaceUnsafeUrlCharacters(Utils.normalizeString(name));
    const n = urlName.split(' ').join('-');

    const urlSurname = this.replaceUnsafeUrlCharacters(Utils.normalizeString(surname));
    const s = urlSurname.split(' ').join('-');

    const id = suffix ? `${n}-${s}_${suffix}` : `${n}-${s}`;
    return id;
  }

  private static replaceUnsafeUrlCharacters(str: string) {
    const fixed = str.replace(/[^a-zA-Z0-9-_]/g, ' ');
    const spacesCleaned = fixed.replace(/\s\s+/g, ' ');
    return spacesCleaned;
  }
}
