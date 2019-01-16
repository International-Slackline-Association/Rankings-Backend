import { NestFactory } from '@nestjs/core';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as dotenv from 'dotenv-override';

import { AllExceptionsFilter } from 'shared/filters/exception.filter';
import { waitForLogger } from 'shared/logger';
import { AppModule } from './api.module';

// Because: https://github.com/motdotla/node-lambda/pull/369
dotenv.config({ override: true });

import * as serverless from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { Server } from 'http';
let cachedServer: Server;

// tslint:disable-next-line:no-var-requires
const express = require('express')();

async function bootstrapServer(): Promise<any> {
  return NestFactory.create(AppModule, express, {
    bodyParser: true,
  })
    .then(app => {
      app.use(eventContext());
      app.useGlobalFilters(new AllExceptionsFilter());
      app.setGlobalPrefix('admin/api');
      app.enableCors();
      return app.init();
    })
    .then(() => {
      return serverless.createServer(express);
    });
}

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {
  // context.callbackWaitsForEmptyEventLoop = false;
  context.succeed = succeedWaitsLogger(context.succeed);
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return serverless.proxy(cachedServer, event, context, 'PROMISE').promise;
};

function succeedWaitsLogger(succeed: Context['succeed']): Context['succeed'] {
  return (messageObject: any) => {
    waitForLogger()
      .then(() => {
        console.log('Response: ', messageObject);
        succeed(messageObject);
      })
      .catch(error => {
        console.error('Callback error: ', error);
        succeed(messageObject);
      });
  };
}
