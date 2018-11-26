import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from 'shared/decorators/roles.decorator';
import { AuthenticationRole } from 'shared/enums';
import { RolesGuard } from 'shared/guards/roles.guard';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { SubmitContestResultDto, submitContestResultDtoSchema } from './dto/submit-contest-result.dto';
import { SubmitContestResultService } from './submit-contest-result.service';

@Controller('submit/contest/results')
export class SubmitContestResultController {
  constructor(private readonly service: SubmitContestResultService) {}

  @Post()
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(submitContestResultDtoSchema))
  public async submitContestResults(@Body() submitContestResultdto: SubmitContestResultDto) {
    return await this.service.submitContestResult(submitContestResultdto);
  }
}
