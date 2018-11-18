import * as dotenv from 'dotenv-override';
// Because: https://github.com/motdotla/node-lambda/pull/369
dotenv.config({ override: true });

import serverlessHttp = require('serverless-http');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { waitForLogger } from 'shared/logger';
import { AllExceptionsFilter } from 'shared/filters/exception.filter';

// tslint:disable-next-line:no-var-requires
const express = require('express')();

let isBoostrapped: boolean = false;

async function bootstrap(): Promise<any> {
  return NestFactory.create(AppModule, express, {
    bodyParser: true,
    logger: false,
  })
    .then(app => {
      app.useGlobalFilters(new AllExceptionsFilter());
      app.setGlobalPrefix('api');
      return app.init();
    })
    .then(app => {
      isBoostrapped = true;
      return app;
    })
    .catch(err => {
      console.log('Bootstrap Error: ', err);
    });
}

export const handler = serverlessHttp(express, {
  request: async (
    request: Request,
    event: APIGatewayEvent,
    context: Context,
  ) => {
    if (!isBoostrapped) {
      console.log('Bootstraping NestJS');
      await bootstrap();
    }
  },
  response: async (response, event, context) => {
    await waitForLogger();
  },
});
