import { Injectable } from '@nestjs/common';

import winston = require('winston');
import * as WSCloudWatch from 'winston-cloudwatch';
import { ConfigurationService } from 'shared/configuration/configuration.service';
const WinstonCloudWatch = WSCloudWatch as any; // Types are incompatible with winston 3.0.0. Disable type forcing

@Injectable()
export class LoggerService {
  constructor(private readonly configurationService: ConfigurationService) {}

  private debugLevel = this.configurationService.LoggerDebugLevel;

  private winstonCloudWatchTransport = new WinstonCloudWatch({
    level: this.debugLevel,
    messageFormatter: this.cloudWatchMessageFormatter,
    logGroupName: 'ISA_Rankings/ApplicationLogs',
    logStreamName: () => {
      const date = new Date().toISOString().split('T')[0];
      return date;
    },
  });

  public async waitForLogger() {
    return new Promise((r, j) => {
      this.winstonCloudWatchTransport.kthxbye(() => {
        // waitForTransports(logger).then(() => {
        r();
        // });
      });
    });
  }

  private cloudWatchMessageFormatter(log: winston.LogObject): string {
    const meta = { ...log.meta };
    delete meta.level;
    delete meta.message;

    const obj = {
      logLevel: log.level,
      message: log.msg,
      data: meta,
    };

    return JSON.stringify(obj);
  }

  private async waitForTransports(l) {
    const transportsFinished = l.transports.map(
      t => new Promise(resolve => t.on('finish', resolve)),
    );
    l.end();
    return Promise.all(transportsFinished);
  }

  private winstonFormat() {
    if (process.env.IS_OFFLINE === 'true') {
      // tslint:disable-next-line:ban-comma-operator
      return winston.format.combine(
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.simple(),
      );
    }
    return winston.format.combine(
      winston.format.splat(),
      winston.format.simple(),
    );
  }

  public logger = winston.createLogger({
    level: this.debugLevel,
    exitOnError: false,
    format: this.winstonFormat(),
    transports: [
      new winston.transports.Console(),
      this.winstonCloudWatchTransport,
    ],
    exceptionHandlers: [this.winstonCloudWatchTransport],
  });
}
