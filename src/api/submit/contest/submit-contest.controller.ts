import {
  Controller,
  Get,
  UsePipes,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import {
  addContestDisciplineDtoSchema,
  AddContestDisciplineDto,
} from './dto/add-contest-discipline.dto';
import { Roles } from 'shared/decorators/roles.decorator';
import { RolesGuard } from 'shared/guards/roles.guard';
import { AuthenticationRole } from 'shared/enums';
import { CreateContestDto, createContestDtoSchema } from './dto/create-contest';
import { SubmitContestService } from './submit-contest.service';

@Controller('submit/contest')
export class SubmitContestController {
  constructor(private readonly service: SubmitContestService) {}

  @Post()
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(createContestDtoSchema))
  async createContest(@Body() createContestDto: CreateContestDto) {
    return this.service.createContest(createContestDto);
  }

  @Post('add')
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(addContestDisciplineDtoSchema))
  async addContest(@Body() addContestDisciplineDto: AddContestDisciplineDto) {
    return addContestDisciplineDto;
  }
}
