import { Injectable } from '@nestjs/common';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import * as moment from 'moment';
import { Utils } from 'shared/utils';
import { DDBAthleteDetailItem } from '../athlete.details.interface';

@Injectable()
export class EntityTransformer {
  constructor() {}

  public toDBItem(athlete: AthleteDetail): DDBAthleteDetailItem {
    return {
      athleteId: athlete.id,
      birthdate: athlete.birthdate.toISODate(),
      country: athlete.country,
      createdAt: athlete.createdAt || moment().unix(),
      gender: athlete.gender,
      name: athlete.name,
      normalizedName: Utils.normalizeString(athlete.name),
      profileUrl: athlete.profileUrl || undefined,
      surname: athlete.surname,
      city: athlete.city,
      email: athlete.email,
      infoUrl: athlete.infoUrl || undefined,
    };
  }

  public fromDBItem(athlete: DDBAthleteDetailItem): AthleteDetail {
    if (!athlete) {
      return null;
    }
    return new AthleteDetail({
      id: athlete.athleteId,
      birthdate: new Date(athlete.birthdate),
      country: athlete.country,
      createdAt: athlete.createdAt,
      gender: athlete.gender,
      name: athlete.name,
      profileUrl: athlete.profileUrl || '',
      surname: athlete.surname,
      city: athlete.city,
      email: athlete.email,
      infoUrl: athlete.infoUrl || '',
    });
  }
}
