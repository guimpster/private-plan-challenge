import { DynamicModule, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AccountController } from './api/account/account.controller';
import { WithdrawalController } from './api/withdrawal/withdrawal.controller';
import { BradescoController } from './webhooks/banks/bradesco/bradesco.controller';
import { AccountCqrsModule } from '../cqrs/account/account.module';
import { WithdrawalsModule } from '../cqrs/withdrawal/withdrawal.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

export interface PortModuleOptions {
  database: 'inMemory';
}

@Module({})
export class PortModule {
  static register(options: PortModuleOptions): DynamicModule {
    const { database } = options;

    // Validate database option
    if (database !== 'inMemory') {
      throw new Error(`Unsupported database: ${database}. Only 'inMemory' is currently supported.`);
    }

    return {
      module: PortModule,
      imports: [
        CqrsModule,
        InfrastructureModule,
        AccountCqrsModule,
        WithdrawalsModule,
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
