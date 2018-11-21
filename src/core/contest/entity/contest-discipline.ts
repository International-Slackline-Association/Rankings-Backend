import { Discipline, ContestCategory, PrizeUnit } from 'shared/enums';

export class ContestDiscipline {
  id: string;
  name: string;
  date: number;
  city: string;
  country: string;
  discipline: Discipline;
  category: ContestCategory;
  prize: number;
  prizeUnit: PrizeUnit;
  createdAt?: number;
}
