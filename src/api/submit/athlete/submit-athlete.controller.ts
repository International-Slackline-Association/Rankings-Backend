import { Body, Controller, Put, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from 'shared/decorators/roles.decorator';
import { AuthenticationRole } from 'shared/enums';
import { RolesGuard } from 'shared/guards/roles.guard';
import { JoiValidationPipe } from 'shared/pipes/JoiValidation.pipe';
import { CreateAthleteDto, createAthleteDtoSchema } from './dto/create-athlete.dto';
import { SubmitAthleteService } from './submit-athlete.service';

@Controller('submit/athlete')
export class SubmitAthleteController {
  constructor(private readonly service: SubmitAthleteService) {}

  @Put()
  @Roles(AuthenticationRole.admin)
  @UseGuards(RolesGuard)
  @UsePipes(new JoiValidationPipe(createAthleteDtoSchema))
  public async createAthlete(@Body() createAthleteDto: CreateAthleteDto) {
    return await this.service.createAthlete(createAthleteDto);
  }
}
