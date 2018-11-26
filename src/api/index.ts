import { NestFactory } from '@nestjs/core';
import { APIGatewayEvent, Context } from 'aws-lambda';
import * as dotenv from 'dotenv-override';
import { AllExceptionsFilter } from 'shared/filters/exception.filter';
import { waitForLogger } from 'shared/logger';
import { AppModule } from './api.module';
// Because: https://github.com/motdotla/node-lambda/pull/369
dotenv.config({ override: true });

import serverlessHttp = require('serverless-http');

// tslint:disable-next-line:no-var-requires
const express = require('express')();

let isBoostrapped: boolean = false;

async function bootstrap(): Promise<any> {
  return NestFactory.create(AppModule, express, {
    bodyParser: true,
  })
    .then(app => {
      app.useGlobalFilters(new AllExceptionsFilter());
      app.setGlobalPrefix('api');
      return app.init();
    })
    .then(app => {
      isBoostrapped = true;
      return app;
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
