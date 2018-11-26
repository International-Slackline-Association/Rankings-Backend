import { Body, Controller, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from 'shared/decorators/roles.decorator';
import { AuthenticationRole } from 'shared/enums';
import { RolesGuard } from 'shared/guards/roles.guard';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { CreateContestDto, createContestDtoSchema } from './dto/create-contest.dto';
import { SubmitContestService } from './submit-contest.service';

@Controller('submit/contest')
export class SubmitContestController {
  constructor(private readonly service: SubmitContestService) {}

  @Put()
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(createContestDtoSchema))
  public async createContest(@Body() createContestDto: CreateContestDto) {
    return await this.service.createContest(createContestDto);
  }
}
