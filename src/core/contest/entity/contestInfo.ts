import { Discipline, ContestCategory, PrizeUnit } from 'shared/enums';

export interface IContestInfo {
  id: string;
  name: string;
  date: number;
  city: string;
  country: string;
  disciplines: Discipline[];
  categories: ContestCategory[];
  totalPrize: number;
  prizeUnit: PrizeUnit;
  profilePictureUrl: string;
  createdAt?: number;
}

export class ContestInfo implements IContestInfo {
  id: string;
  name: string;
  date: number;
  city: string;
  country: string;
  disciplines: Discipline[];
  categories: ContestCategory[];
  totalPrize: number;
  prizeUnit: PrizeUnit;
  profilePictureUrl: string;
  createdAt?: number;
}
