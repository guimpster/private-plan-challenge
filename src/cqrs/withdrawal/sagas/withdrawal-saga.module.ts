import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WithdrawalSaga } from './withdrawal-saga';
import { PrivatePlanWithdrawalService } from '../../../business/domain/services/private-plan-withdrawal.service';
import { PrivatePlanWithdrawalRepository } from '../../../business/repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../../../business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanWithdrawalRepository } from '../../../repository/in-memory/in-memory-private-plan-withdrawal.repository';
import { InMemoryPrivatePlanAccountRepository } from '../../../repository/in-memory/in-memory-private-plan-account.repository';
import { InfrastructureModule } from '../../../infrastructure/infrastructure.module';
import { InMemoryDbModule } from '../../../infrastructure/db/in-memory/in-memory-db';

@Module({
  imports: [CqrsModule, InfrastructureModule, InMemoryDbModule.forRoot()],
  providers: [
    WithdrawalSaga,
    PrivatePlanWithdrawalService,
    InMemoryPrivatePlanWithdrawalRepository,
    InMemoryPrivatePlanAccountRepository,
    {
      provide: PrivatePlanWithdrawalRepository,
      useExisting: InMemoryPrivatePlanWithdrawalRepository
    },
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository
    },
    {
      provide: 'PrivatePlanWithdrawalRepository',
      useExisting: InMemoryPrivatePlanWithdrawalRepository
    },
    {
      provide: 'PrivatePlanAccountRepository',
      useExisting: InMemoryPrivatePlanAccountRepository
    }
  ],
})
export class WithdrawalSagaModule {}
