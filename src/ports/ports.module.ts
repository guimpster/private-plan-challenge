import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountController } from './api/account/account.controller';
import { WithdrawalController } from './api/withdrawal/withdrawal.controller';
import { BradescoController } from './webhooks/banks/bradesco/bradesco.controller';
import { AccountCqrsModule } from '../cqrs/account/account.module';
import { WithdrawalCqrsModule } from '../cqrs/withdrawal/withdrawal.module';

export interface PortsModuleOptions {
  database: 'inMemory';
}

@Module({})
export class PortsModule {
  static register(options: PortsModuleOptions): DynamicModule {
    const { database } = options;

    // Validate database option
    if (database !== 'inMemory') {
      throw new Error(`Unsupported database: ${database}. Only 'inMemory' is currently supported.`);
    }

    return {
      module: PortsModule,
      imports: [
        CqrsModule,
        AccountCqrsModule,
        WithdrawalCqrsModule,
      ],
      controllers: [
        AccountController,
        WithdrawalController,
        BradescoController,
      ],
      providers: [],
      exports: [],
    };
  }
}
