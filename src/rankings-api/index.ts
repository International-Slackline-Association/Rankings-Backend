import serverlessHttp = require('serverless-http');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
// tslint:disable-next-line:no-var-requires
const express = require('express')();

let isBoostrapped: boolean = false;

function bootstrap(): Promise<any> {
    return NestFactory.create(AppModule, express)
      .then(app => app.init());
  }

export const handler = serverlessHttp(express, {
    request: async (request: Request, event: APIGatewayEvent, context: Context) => {
        if (!isBoostrapped) {
            console.log('Bootstraping NestJS');
            await bootstrap();
            isBoostrapped = true;
        }
    },
});
