import { Controller, Get, UsePipes, Body, Post, UseGuards } from '@nestjs/common';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { addContestDtoSchema, AddContestDto } from './dto/add-contest.dto';
import { Roles } from 'shared/decorators/roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { AuthenticationRole } from 'shared/enums';

@Controller('submit')
export class SubmitApiController {
  constructor() {}

  @Post()
  @Roles(AuthenticationRole.admin)
  // @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(addContestDtoSchema))
  async addContest(@Body() addContestDto: AddContestDto) {
    return addContestDto;
  }
}
