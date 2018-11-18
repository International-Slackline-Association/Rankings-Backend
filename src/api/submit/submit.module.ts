import { Module } from '@nestjs/common';
import { SubmitApiController } from './submit.controller';

@Module({
  controllers: [SubmitApiController],
  providers: [],
})
export class SubmitApiModule {}
