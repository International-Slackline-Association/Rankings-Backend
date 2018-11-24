import { Controller, UsePipes, Body, UseGuards, Post } from '@nestjs/common';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Roles } from 'shared/decorators/roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { AuthenticationRole } from 'shared/enums';
import {
  SubmitContestResultDto,
  submitContestResultDtoSchema,
} from './dto/submit-contest-result.dto';
import { SubmitContestResultService } from './submit-contest-result.service';

@Controller('submit/contest')
export class SubmitContestResultController {
  constructor(private readonly service: SubmitContestResultService) {}

  @Post()
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(submitContestResultDtoSchema))
  async createContest(@Body() submitContestResultdto: SubmitContestResultDto) {
    return await this.service.submitContestResult(submitContestResultdto);
  }
}
