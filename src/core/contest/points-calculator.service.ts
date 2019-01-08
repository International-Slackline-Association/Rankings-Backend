import { Injectable } from '@nestjs/common';
import { ContestResult } from 'api/admin/submit/results/dto/submit-contest-result.dto';
import { Constants } from 'shared/constants';
import { ContestCategory } from 'shared/enums';

export interface DetailedContestResult extends ContestResult {
  readonly category: ContestCategory;
}

export interface AthletePointsDictionary {
  [key: string]: { points: number; place: number };
}

@Injectable()
export class ContestPointsCalculatorService {
  constructor() {}

  public calculatePoints(results: DetailedContestResult): AthletePointsDictionary {
    const calculatedAthletePoints = results.places.map((athlete, index) => {
      const place = index + 1;
      const points = this.calculatePoint(
        Constants.ContestCategoryTopPoints(results.category),
        place,
        results.places.length,
      );
      return {
        athleteId: athlete.athleteId,
        points: points,
        place: place,
      };
    });
    const athletePoints: AthletePointsDictionary = {};
    calculatedAthletePoints.forEach(p => {
      athletePoints[p.athleteId] = { points: p.points, place: p.place };
    });
    return athletePoints;
  }

  private calculatePoint(pointOfFirstPlace: number, place: number, numberOfParticipants: number) {
    // For details check ISA's score calculation algoritm
    const numberOfParticipantsLimit = Constants.ScoringRange;
    const A = (1 - pointOfFirstPlace) / Math.log(Math.min(numberOfParticipants, numberOfParticipantsLimit));
    const B = pointOfFirstPlace;

    const point = A * Math.log(place) + B;
    return Math.round(point);
  }
}
