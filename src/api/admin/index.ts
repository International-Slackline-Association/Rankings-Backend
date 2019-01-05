import { NestFactory } from '@nestjs/core';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as dotenv from 'dotenv-override';

import { AllExceptionsFilter } from 'shared/filters/exception.filter';
import { waitForLogger } from 'shared/logger';
import { AppModule } from './api.module';

// Because: https://github.com/motdotla/node-lambda/pull/369
dotenv.config({ override: true });

import * as serverless from 'aws-serverless-express';
import { Server } from 'http';
let cachedServer: Server;

// tslint:disable-next-line:no-var-requires
const express = require('express')();

async function bootstrapServer(): Promise<any> {
  return NestFactory.create(AppModule, express, {
    bodyParser: true,
  })
    .then(app => {
      app.useGlobalFilters(new AllExceptionsFilter());
      app.setGlobalPrefix('admin/api');
      return app.init();
    })
    .then(() => {
      return serverless.createServer(express);
    });
}

export const handler: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  if (!cachedServer) {
    bootstrapServer().then(server => {
      cachedServer = server;
      return serverless.proxy(server, event, context, 'CALLBACK', callbackWaitsLogger(callback));
    });
  } else {
    return serverless.proxy(cachedServer, event, context, 'CALLBACK', callbackWaitsLogger(callback));
  }
};

function callbackWaitsLogger(callback: Callback): Callback {
  return (err, response) => {
    waitForLogger()
      .then(() => {
        callback(err, response);
      })
      .catch(error => {
        console.error('Callback error: ', error);
        callback(err, response);
      });
  };
}
