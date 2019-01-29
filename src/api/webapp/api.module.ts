import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MethodOverrideMiddleware } from '@nest-middlewares/method-override';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import env_variables from 'shared/env_variables';

import { AthleteModule } from './athlete/athlete.module';
import { ContestModule } from './contest/contest.module';
import { CountryModule } from './country/country.module';
import { NestJSTestController } from './nestjsTest.controller';
import { RankingsModule } from './rankings/rankings.module';

@Module({
  imports: [CountryModule, AthleteModule, ContestModule, RankingsModule],
  controllers: [NestJSTestController],
  providers: [],
  exports: [],
})
export class AppModule {
  public configure(consumer: MiddlewareConsumer) {
    MorganMiddleware.configure(env_variables.morganConfig);
    consumer.apply(MorganMiddleware).forRoutes('*');
    consumer.apply(MethodOverrideMiddleware).forRoutes('*');
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }
}
