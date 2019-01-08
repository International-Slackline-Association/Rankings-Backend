import { Injectable } from '@nestjs/common';
import { Contest } from 'core/contest/entity/contest';
import { DatabaseService } from 'core/database/database.service';
import { Discipline } from 'shared/enums';
import { IdGenerator } from 'shared/generators/id.generator';
import { Utils } from 'shared/utils';
import { SubmitContestDto } from './dto/submit-contest.dto';

@Injectable()
export class SubmitContestService {
  constructor(private readonly db: DatabaseService) {}
  public async createContest(dto: SubmitContestDto) {
    const contestDate = new Date(dto.date);
    const id = IdGenerator.generateContestId(dto.name, Utils.dateToMoment(contestDate).year());
    const contest = new Contest({
      ...dto,
      id: id,
      date: contestDate,
    });
    await this.db.putContest(contest);
    return { id: contest.id, discipline: contest.discipline };
  }

  public async modifyContest(dto: SubmitContestDto) {
    const contestDate = new Date(dto.date);
    const contest = new Contest({
      ...dto,
      date: contestDate,
    });
    await this.db.putContest(contest);
    return { id: contest.id, discipline: contest.discipline };
  }

  public async updateContestProfileUrl(contestId: string, discipline: Discipline, url: string) {
    return this.db.updateContestProfileUrl(contestId, discipline, url);
  }
}
