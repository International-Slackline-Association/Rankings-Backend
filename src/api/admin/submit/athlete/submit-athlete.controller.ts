import { Body, Controller, Post, Put, UsePipes } from '@nestjs/common';
import { Roles } from 'shared/decorators/roles.decorator';
import { AuthenticationRole } from 'shared/enums';
import { RolesGuard } from 'shared/guards/roles.guard';
import { logger } from 'shared/logger';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { SubmitAthleteDto, submitAthleteDtoSchema } from './dto/submit-athlete.dto';
import { SubmitAthleteResponse } from './dto/submit-athlete.response';
import { SubmitAthletePictureDto, submitAthletePictureDtoSchema } from './dto/submit-picture.dto';
import { SubmitAthleteService } from './submit-athlete.service';

@Controller('submit/athlete')
export class SubmitAthleteController {
  constructor(private readonly service: SubmitAthleteService) {}

  @Post()
  // @Roles(AuthenticationRole.admin)
  // @UseGuards(RolesGuard) // Lambda Authorizer is applied
  @UsePipes(new JoiValidationPipe(submitAthleteDtoSchema))
  public async submitAthlete(@Body() dto: SubmitAthleteDto) {
    logger.info('Submit Athlete', { data: dto });
    let id: string;
    if (dto.id) {
      id = await this.service.modifyAthlete(dto);
    } else {
      id = await this.service.createAthlete(dto);
    }
    const response = new SubmitAthleteResponse(id);
    return response;
  }

  @Post('picture')
  // @Roles(AuthenticationRole.admin)
  // @UseGuards(RolesGuard) // Lambda Authorizer is applied
  @UsePipes(new JoiValidationPipe(submitAthletePictureDtoSchema))
  public async submitAthletePicture(@Body() dto: SubmitAthletePictureDto) {
    await this.service.updateAthleteProfileUrl(dto.id, dto.url);
  }
}
