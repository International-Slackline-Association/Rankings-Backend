import winston = require('winston');
import * as WSCloudWatch from 'winston-cloudwatch';
const WinstonCloudWatch = WSCloudWatch as any; // Types are incompatible with winston 3.0.0. Disable type forcing

import env_variables from './env_variables';

const debugLevel = env_variables.LoggerDebugLevel;

function cloudWatchMessageFormatter(log: winston.LogObject): string {
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

const winstonCloudWatchTransport = new WinstonCloudWatch({
  level: debugLevel,
  messageFormatter: cloudWatchMessageFormatter,
  logGroupName: 'ISA_Rankings/ApplicationLogs',
  logStreamName: () => {
    const date = new Date().toISOString().split('T')[0];
    return date;
  },
});

export const waitForLogger = async () => {
  return new Promise((r, j) => {
    winstonCloudWatchTransport.kthxbye(() => {
      // waitForTransports(logger).then(() => {
      r();
      // });
    });
  });
};

async function waitForTransports(l) {
  const transportsFinished = l.transports.map(
    t => new Promise(resolve => t.on('finish', resolve)),
  );
  l.end();
  return Promise.all(transportsFinished);
}

const winstonFormat = () => {
  if (env_variables.IS_OFFLINE) {
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
};

const winstonTransports = () => {
  if (env_variables.IS_OFFLINE) {
    return [new winston.transports.Console()];
  }
  return [new winston.transports.Console(), winstonCloudWatchTransport];
};

export const logger = winston.createLogger({
  level: debugLevel,
  exitOnError: false,
  format: winstonFormat(),
  transports: winstonTransports(),
  exceptionHandlers: [winstonCloudWatchTransport],
});
