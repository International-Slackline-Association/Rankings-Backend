import { Injectable } from '@nestjs/common';
import { ContestResult } from 'api/admin/submit/results/dto/submit-contest-result.dto';
import { groupBy } from 'lodash';
import { Constants } from 'shared/constants';
import { ContestCategory } from 'shared/enums';

export interface DetailedContestResult extends ContestResult {
  readonly category: ContestCategory;
}

export interface AthletePointsDictionary {
  [key: string]: { points: number; place: number };
}

interface IAthletePoint {
  athlete: { athleteId: string; place: number };
  points: number;
}

@Injectable()
export class ContestPointsCalculatorService {
  constructor() {}

  public calculatePoints(results: DetailedContestResult): AthletePointsDictionary {
    const numOfParticipants = results.places.length;
    const pointOfFirstPlace = Constants.ContestCategoryTopPoints(results.category);
    let calculatedAthletePoints = results.places.map<IAthletePoint>((athlete, index) => {
      const defaultPlace = index + 1;
      const points = this.calculatePoint(pointOfFirstPlace, defaultPlace, numOfParticipants);
      return {
        athlete: athlete,
        points: points,
      };
    });

    calculatedAthletePoints = this.calculatePointsForTie(calculatedAthletePoints);

    const athletePoints: AthletePointsDictionary = {};
    calculatedAthletePoints.forEach(p => {
      athletePoints[p.athlete.athleteId] = { points: p.points, place: p.athlete.place };
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

  private calculatePointsForTie(calculatedAthletePoints: IAthletePoint[]) {
    const pointsGroup = groupBy(calculatedAthletePoints, a => a.athlete.place);
    const modifiedAthletePointArray: IAthletePoint[] = [];

    for (const place in pointsGroup) {
      if (pointsGroup.hasOwnProperty(place)) {
        const athletePointArray = pointsGroup[place];
        if (athletePointArray.length > 1) {
          const average = athletePointArray.map(a => a.points).reduce((a, b) => a + b, 0) / athletePointArray.length;
          athletePointArray.forEach(a => modifiedAthletePointArray.push({ ...a, points: Math.round(average) }));
        } else {
          modifiedAthletePointArray.push(...athletePointArray);
        }
      }
    }
    return modifiedAthletePointArray;
  }
}
