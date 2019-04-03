import * as moment from 'moment';
import { AgeCategory, Gender } from 'shared/enums';
import { AgeCategoryUtility } from 'shared/enums/enums-utility';
import { Utils } from 'shared/utils';

export class AthleteDetail {
  public readonly id: string;
  public readonly name: string;
  public readonly surname: string;
  public readonly profileUrl: string;
  public readonly thumbnailUrl: string;
  public readonly gender: Gender;
  public readonly country: string;
  public readonly birthdate?: Date;
  public readonly email: string;
  public readonly city: string;
  public readonly infoUrl: string;
  public readonly createdAt?: number;

  public get age(): number | null {
    const birthDate = Utils.dateToMoment(this.birthdate);
    if (birthDate) {
      const age = moment()
        .utc()
        .diff(birthDate, 'years');
      return age;
    }
    return null;
  }

  public get ageCategory(): AgeCategory {
    return AgeCategoryUtility.getAgeCategoryOfAge(this.age);
  }

  constructor(init: {
    id: string;
    name: string;
    surname: string;
    profileUrl: string;
    thumbnailUrl: string;
    gender: Gender;
    country: string;
    birthdate?: Date;
    email: string;
    city: string;
    infoUrl: string;
    createdAt?: number;
  }) {
    if (init) {
      if (!init.thumbnailUrl && init.profileUrl) {
        const [fileType, ...url] = init.profileUrl.split('.').reverse();
        if (fileType === 'jpg' || fileType === 'png') {
          const thumbnailUrl = `${url.reverse().join('.')}_thumbnail.${fileType}`;
          init.thumbnailUrl = thumbnailUrl;
        }
      }
      Object.assign(this, init);
    }
  }
}
