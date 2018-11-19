export class IdGenerator {
  /** contest-name + year is a unique human readable entity */
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
    // TODO: check names for special characters
    // example name_surname, name_surname_1
    return suffix ? `${name}-${surname}-${suffix}` : `${name}-${surname}`;
  }
}
