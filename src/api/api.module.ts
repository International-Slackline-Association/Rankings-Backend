import { Module, MiddlewareConsumer } from '@nestjs/common';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { MethodOverrideMiddleware } from '@nest-middlewares/method-override';

import env_variables from 'shared/env_variables';
import { SubmitContestModule } from './submit/contest/submit-contest.module';

@Module({
  imports: [SubmitContestModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure(env_variables.morganConfig);
    consumer.apply(MorganMiddleware).forRoutes('*');
    consumer.apply(MethodOverrideMiddleware).forRoutes('*');
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
