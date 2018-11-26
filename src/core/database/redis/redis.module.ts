import { DynamicModule, Module } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { ClientOpts } from 'redis';
import { RedisConfig } from './redis.config';
import { RedisRepository } from './redis.repo';

@Module({
  imports: [],
  providers: [RedisRepository],
  exports: [RedisRepository],
})
export class RedisRepositoryModule {
  public static withConfig(opts: ClientOpts): DynamicModule {
    const redisConfig = {
      provide: RedisConfig,
      useFactory: () => {
        return new RedisConfig(opts);
      },
    };
    return {
      module: RedisRepositoryModule,
      providers: [redisConfig],
      exports: [redisConfig],
    };
  }
  public static forTest(opts: ClientOpts): ModuleMetadata {
    const redisConfig = {
      provide: RedisConfig,
      useFactory: () => {
        return new RedisConfig(opts);
      },
    };
    return {
      providers: [redisConfig],
      exports: [redisConfig],
    };
  }
}
