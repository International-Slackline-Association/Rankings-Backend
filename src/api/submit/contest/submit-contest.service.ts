import { Injectable } from '@nestjs/common';
import { ContestDiscipline } from 'core/contest/entity/contest-discipline';
import { DatabaseService } from 'core/database/database.service';
import { IdGenerator } from 'shared/generators/id.generator';
import { Utils } from 'shared/utils';
import { CreateContestDto } from './dto/create-contest.dto';

@Injectable()
export class SubmitContestService {
  constructor(private readonly db: DatabaseService) {}
  public async createContest(createContestDto: CreateContestDto) {
    const id = IdGenerator.generateContestId(createContestDto.name, Utils.unixToDate(createContestDto.date).year());

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
