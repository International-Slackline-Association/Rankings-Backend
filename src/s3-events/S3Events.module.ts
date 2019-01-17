import { Module } from '@nestjs/common';

import { S3ImageResizerModule } from './image-resizer/S3ImageResizer.module';
import { S3EventsService } from './S3Events.service';

@Module({
  imports: [S3ImageResizerModule],
  providers: [S3EventsService],
})
export class S3EventsModule {}
