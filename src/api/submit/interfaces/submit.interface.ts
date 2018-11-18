import { Discipline, ContestCategory } from 'shared/enums';

interface Contest {
  id: string;
  name: string;
  prize: string;
  size: ContestCategory;
  date: number;
  city: string;
  country: string;
  discipline: Discipline;
  profilePictureUrl: string;
}
