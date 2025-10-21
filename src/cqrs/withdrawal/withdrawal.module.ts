import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as CommandHandlers from './commands/command-handlers';
import * as QueryHandlers from './queries/query-handlers';
import { PrivatePlanWithdrawalService } from 'src/business/domain/services/private-plan-withdrawal.service';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { PrivatePlanWithdrawalRepository } from 'src/business/repository/private-plan-withdrawal.repository';
import { InMemoryPrivatePlanWithdrawalRepository } from 'src/repository/in-memory/in-memory-private-plan-withdrawal.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { WithdrawalSagaModule } from './sagas/withdrawal-saga.module';

@Module({
  imports: [CqrsModule, InfrastructureModule, WithdrawalSagaModule],
  providers: [
    ...Object.values(CommandHandlers).filter(v => typeof v === 'function'),
    ...Object.values(QueryHandlers).filter(v => typeof v === 'function'),
    PrivatePlanWithdrawalService, 
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
    {
      provide: PrivatePlanWithdrawalRepository,
      useExisting: InMemoryPrivatePlanWithdrawalRepository,
    }
  ],
  exports: [PrivatePlanWithdrawalService, CqrsModule],
})
export class WithdrawalsModule {}