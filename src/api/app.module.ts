import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'core/database/database.module';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { MethodOverrideMiddleware } from '@nest-middlewares/method-override';

import env_variables from 'shared/env_variables';
import { DynamoDBServices } from 'core/aws/aws.services';

@Module({
  imports: [DatabaseModule.withConfig(new DynamoDBServices())],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure(env_variables.morganConfig);
    consumer.apply(MorganMiddleware).forRoutes('*');
    consumer.apply(MethodOverrideMiddleware).forRoutes('*');
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
