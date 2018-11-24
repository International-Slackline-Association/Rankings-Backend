import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { IdGenerator } from 'shared/generators/id.generator';
import { unixToDate } from 'shared/utils';
import { ContestInfo } from 'core/contest/entity/contestInfo';
import { Contest } from 'core/contest/entity/contest';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';

@Injectable()
export class SubmitContestService {
  constructor(private readonly db: DatabaseService) {}
  public async createContest(createContestDto: CreateContestDto) {
    const id = IdGenerator.generateContestId(
      createContestDto.name,
      unixToDate(createContestDto.date).year(),
    );

    for (const disciplineGroup of createContestDto.disciplines) {
      const contestDiscipline: ContestDiscipline = {
        city: createContestDto.city,
        country: createContestDto.country,
        date: createContestDto.date,
        id: id,
        name: createContestDto.name,
        profilePictureUrl: createContestDto.profilePictureUrl,
        category: disciplineGroup.category,
        discipline: disciplineGroup.discipline,
        prize: disciplineGroup.prize.value,
        prizeUnit: disciplineGroup.prize.unit,
      };
      await this.db.putContestDiscipline(contestDiscipline);
    }
    return id;
  }
}
