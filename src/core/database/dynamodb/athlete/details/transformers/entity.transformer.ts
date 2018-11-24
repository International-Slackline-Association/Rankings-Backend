import { Injectable } from '@nestjs/common';
import { DDBAthleteDetailItem } from '../athlete.details.interface';
import { AthleteDetail } from 'core/athlete/entity/athlete-detail';
import { normalizeStringForSearching } from 'shared/utils';

@Injectable()
export class EntityTransformer {
  constructor() {}

  public toDBItem(athlete: AthleteDetail): DDBAthleteDetailItem {
    return {
      ageCategory: athlete.ageCategory,
      athleteId: athlete.id,
      birthEpoch: athlete.birth,
      continent: athlete.continent,
      country: athlete.country,
      createdAt: athlete.createdAt,
      gender: athlete.gender,
      name: athlete.name,
      normalizedName: normalizeStringForSearching(athlete.name),
      profilePictureUrl: athlete.profilePictureUrl,
      surname: athlete.surname,
    };
  }

  public fromDBItem(athlete: DDBAthleteDetailItem): AthleteDetail {
    if (!athlete) return null;
    return {
      ageCategory: athlete.ageCategory,
      id: athlete.athleteId,
      birth: athlete.birthEpoch,
      continent: athlete.continent,
      country: athlete.country,
      createdAt: athlete.createdAt,
      gender: athlete.gender,
      name: athlete.name,
      profilePictureUrl: athlete.profilePictureUrl,
      surname: athlete.surname,
    };
  }
}
