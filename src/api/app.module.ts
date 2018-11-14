import { Module, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'core/database/database.module';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MorganMiddleware } from '@nest-middlewares/morgan';
import { MethodOverrideMiddleware } from '@nest-middlewares/method-override';

import env_variables from 'shared/env_variables';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'shared/filters/exception.filter';

@Module({
    imports: [DatabaseModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        MorganMiddleware.configure(env_variables.morganConfig);
        consumer.apply(MorganMiddleware).forRoutes('*');
        consumer.apply(MethodOverrideMiddleware).forRoutes('*');
        consumer.apply(HelmetMiddleware).forRoutes('*');

    }
}
