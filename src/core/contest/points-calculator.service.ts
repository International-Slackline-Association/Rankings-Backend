import { Injectable } from '@nestjs/common';
import { DisciplineResultGroup } from 'api/admin/submit/results/dto/submit-contest-result.dto';
import { Constants } from 'shared/constants';
import { ContestCategory, Discipline } from 'shared/enums';

export interface DetailedDisciplineResultGroup extends DisciplineResultGroup {
  category: ContestCategory;
}

export interface DisciplineResultsGroupCalculated {
  discipline: Discipline;
  results: {
    athleteId: string;
    place: number;
    points: number;
  }[];
}

@Injectable()
export class ContestPointsCalculatorService {
  constructor() {}

  public calculatePointsAndPlace(
    disciplineResults: DetailedDisciplineResultGroup,
  ): DisciplineResultsGroupCalculated {
    this.orderPlaces(disciplineResults.places);
    return this.calculatePointForDisciplineResults(disciplineResults);
  }

  private calculatePointForDisciplineResults(
    disciplineResults: DetailedDisciplineResultGroup,
  ) {
    const calculatedAthletePoints = disciplineResults.places.map(result => {
      const points = this.calculatePoint(
        Constants.ContestCategoryTopPoints(disciplineResults.category),
        result.place,
        disciplineResults.places.length,
      );
      return {
        athleteId: result.athleteId,
        place: result.place,
        points: points,
      };
    });
    return {
      discipline: disciplineResults.discipline,
      results: calculatedAthletePoints,
    };
  }

  private orderPlaces(places) {
    places.sort((a, b) => {
      if (a.place === b.place) {
        return 0;
      } else if (a.place < b.place) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  private calculatePoint(
    pointOfFirstPlace: number,
    place: number,
    numberOfParticipants: number,
  ) {
    // For details check ISA's score calculation algoritm
    const numberOfParticipantsLimit = Constants.ScoringRange;
    const A =
      (1 - pointOfFirstPlace) /
      Math.log(Math.min(numberOfParticipants, numberOfParticipantsLimit));
    const B = pointOfFirstPlace;

    const point = A * Math.log(place) + B;
    return point;
  }
}
