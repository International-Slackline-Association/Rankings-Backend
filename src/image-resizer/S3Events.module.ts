import { Module } from '@nestjs/common';

import { S3EventsService } from './S3Events.service';
import { ThumbnailCreatorModule } from './thumbnail-creator/thumbnail-creator.module';

@Module({
  imports: [ThumbnailCreatorModule],
  providers: [S3EventsService],
})
export class S3EventsModule {}
