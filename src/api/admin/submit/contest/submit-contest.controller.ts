import { Body, Controller, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from 'shared/decorators/roles.decorator';
import { AuthenticationRole, Discipline } from 'shared/enums';
import { RolesGuard } from 'shared/guards/roles.guard';
import { logger } from 'shared/logger';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import {
  BatchSubmitContestDto,
  batchSubmitContestDtoSchema,
  SubmitContestDto,
  submitContestDtoSchema,
} from './dto/submit-contest.dto';
import { SubmitContestResponse } from './dto/submit-contest.response';
import { SubmitContestPictureDto, submitContestPictureDtoSchema } from './dto/submit-picture.dto';
import { SubmitContestService } from './submit-contest.service';

@Controller('submit/contest')
export class SubmitContestController {
  constructor(private readonly service: SubmitContestService) {}

  @Post()
  // @Roles(AuthenticationRole.admin)
  // @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(submitContestDtoSchema))
  public async submitContest(@Body() dto: SubmitContestDto) {
    logger.info('Submit Contest', { data: dto });
    let rsp: { id: string; discipline: Discipline };
    if (dto.id) {
      rsp = await this.service.modifyContest(dto);
    } else {
      rsp = await this.service.createContest(dto);
    }
    const response = new SubmitContestResponse(rsp.id, rsp.discipline);
    return response;
  }

  @Post('batch')
  @UsePipes(new JoiValidationPipe(batchSubmitContestDtoSchema))
  public async batchSubmitAthlete(@Body() dto: BatchSubmitContestDto) {
    for (const contest of dto.data) {
      await this.submitContest(contest);
    }
  }

  @Post('picture')
  // @Roles(AuthenticationRole.admin)
  // @UseGuards(RolesGuard) // Lambda Authorizer is applied
  @UsePipes(new JoiValidationPipe(submitContestPictureDtoSchema))
  public async submitAthletePicture(@Body() dto: SubmitContestPictureDto) {
    await this.service.updateContestProfileUrl(dto.id, dto.discipline, dto.url);
  }
}
