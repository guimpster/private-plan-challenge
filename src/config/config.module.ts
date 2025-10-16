import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigOptions } from './config.options';
import { ConfigService } from './config.service';
import { JsonConfigService } from './providers/json.config.service';
import { EnvConfigService } from './providers/env.config.service';

@Global()
@Module({})
export class ConfigModule {
  static register(configOptions: ConfigOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: ConfigService,
          useClass:
            configOptions.type === 'json'
              ? JsonConfigService
              : EnvConfigService,
        },
      ],
      exports: [ConfigService],
    };
  }
}
