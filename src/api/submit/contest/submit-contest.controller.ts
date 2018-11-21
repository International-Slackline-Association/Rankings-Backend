import { Controller, UsePipes, Body, UseGuards, Put } from '@nestjs/common';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { Roles } from 'shared/decorators/roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { AuthenticationRole } from 'shared/enums';
import {
  CreateContestDto,
  createContestDtoSchema,
} from './dto/create-contest.dto';
import { SubmitContestService } from './submit-contest.service';

@Controller('submit/contest')
export class SubmitContestController {
  constructor(private readonly service: SubmitContestService) {}

  @Put()
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(createContestDtoSchema))
  async createContest(@Body() createContestDto: CreateContestDto) {
    return await this.service.createContest(createContestDto);
  }
}
