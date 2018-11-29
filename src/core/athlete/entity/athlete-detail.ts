import * as moment from 'moment';
import { AgeCategory, Gender } from 'shared/enums';
import { EnumsUtility } from 'shared/enums-utility';
import { Utils } from 'shared/utils';

export class AthleteDetail {
  public readonly id: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly birth: number;
  public readonly gender: Gender;
  public readonly country: string;
  public readonly continent: string;
  public readonly profilePictureUrl: string;
  public readonly createdAt?: number;

  public get ageCategory(): AgeCategory {
    const birthYear = Utils.unixToDate(this.birth).year();
    const age =
      moment()
        .utc()
        .year() - birthYear;
    return EnumsUtility.getAgeCategoryOfAge(age);
  }

  constructor({
    id,
    name,
    surname,
    birth,
    gender,
    country,
    continent,
    profilePictureUrl,
    createdAt,
  }: {
    id: string;
    name: string;
    surname: string;
    birth: number;
    gender: Gender;
    country: string;
    continent: string;
    profilePictureUrl: string;
    createdAt?: number;
  }) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.birth = birth;
    this.gender = gender;
    this.country = country;
    this.continent = continent;
    this.profilePictureUrl = profilePictureUrl;
    this.createdAt = createdAt;
  }
}
