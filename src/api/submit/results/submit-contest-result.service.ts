import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'core/database/database.service';
import { SubmitContestResultDto } from './dto/submit-contest-result.dto';

@Injectable()
export class SubmitContestResultService {
  constructor(private readonly db: DatabaseService) {}
  public async submitContestResult(
    submitContestResultdto: SubmitContestResultDto,
  ) {
    // check contest and disciplines
    // check athletes≈
    // calculate points

    // put athlete contest disciplines

  }
}
