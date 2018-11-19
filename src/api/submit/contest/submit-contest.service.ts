import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
import { CreateContestDto } from './dto/create-contest';
import { IdGenerator } from 'shared/generators/id.generator';
import { unixToDate } from 'shared/utils';
import { ContestInfo } from 'core/contest/entity/contestInfo';
import { Contest } from 'core/contest/entity/contest';

@Injectable()
export class SubmitContestService {
  constructor(private readonly db: DatabaseService) {}
  public async createContest(createContestDto: CreateContestDto) {
    const id = IdGenerator.generateContestId(
      createContestDto.name,
      unixToDate(createContestDto.date).year(),
    );
    const contest = new Contest({ id, ...createContestDto });
    const contestInfo: ContestInfo = {
      ...contest,
      categories: contest.disciplines.map(d => d.category),
      disciplines: contest.disciplines.map(d => d.discipline),
      totalPrize: contest.totalPrize,
      prizeUnit: contest.prizeUnit,
    };
    await this.db.putContestInfo(contestInfo);
  }
}
