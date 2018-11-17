import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationService {
  private env = process.env.NODE_ENV || process.env.ENVIRONMENT || 'production';

  private _loggerDebugLevel: string = process.env.LoggerDebugLevel;

  get isDev(): boolean {
    return !this.isProd;
  }
  get isProd(): boolean {
    return this.env === 'production' || this.env === 'Prod';
  }

  get LoggerDebugLevel(): string {
    return this._loggerDebugLevel || 'debug';
  }
}
