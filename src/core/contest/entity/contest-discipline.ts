import { ContestCategory, Discipline, PrizeUnit } from 'shared/enums';

export class ContestDiscipline {
  public id: string;
  public name: string;
  public date: number;
  public city: string;
  public country: string;
  public discipline: Discipline;
  public category: ContestCategory;
  public prize: number;
  public prizeUnit: PrizeUnit;
  public profilePictureUrl: string;
  public createdAt?: number;
}
