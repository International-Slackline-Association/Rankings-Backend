import { createHandyClient, IHandyRedis } from 'handy-redis';
import { ClientOpts } from 'redis';
import { logger } from 'shared/logger';

export class RedisConfig {
  public isRedisConfigured: boolean = false;
  private _redisClient: IHandyRedis;

  public get redisClient(): IHandyRedis {
    if (this._redisClient) {
      return this._redisClient;
    }
    this.configureRedisClient();
    return this.redisClient;
  }

  constructor(private readonly opts: ClientOpts) {}

  private configureRedisClient() {
    this._redisClient = createHandyClient(this.opts);
    this.isRedisConfigured = true;
    this.stopOnMaxNumOfClientReached();
  }

  private stopOnMaxNumOfClientReached() {
    this.redisClient.redis.on('error', this.endRedisIfConnectionLimit);
  }

  private endRedisIfConnectionLimit = err => {
    logger.error('redis ' + err.toString());
    // would rather check for err.code === 'NR_CLIENTS_EXCEEDED'
    if (err.message.indexOf('max number of clients reached') !== -1) {
      logger.info('redis connection closed');
      this.redisClient.redis.end(true); // stop the retry strategy
    }
  }; // tslint:disable-line
}
