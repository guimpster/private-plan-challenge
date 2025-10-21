import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WithdrawalSaga } from './withdrawal-saga';
import { PrivatePlanWithdrawalService } from '../../../business/domain/services/private-plan-withdrawal.service';
import { PrivatePlanAccountRepository } from '../../../business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from '../../../repository/in-memory/in-memory-private-plan-account.repository';
import { PrivatePlanWithdrawalRepository } from '../../../business/repository/private-plan-withdrawal.repository';
import { InMemoryPrivatePlanWithdrawalRepository } from '../../../repository/in-memory/in-memory-private-plan-withdrawal.repository';
import { BankService } from '../../../business/domain/services/bank.service';
import { BradescoProxy } from '../../../ports/proxy/bradesco.proxy';
import { InMemoryPrivatePlanModule } from '../../../repository/in-memory/in-memory-private-plan-account.module';

@Module({
  imports: [CqrsModule, InMemoryPrivatePlanModule],
  providers: [
    WithdrawalSaga,
    PrivatePlanWithdrawalService,
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
    {
      provide: PrivatePlanWithdrawalRepository,
      useExisting: InMemoryPrivatePlanWithdrawalRepository,
    },
    {
      provide: BankService,
      useClass: BradescoProxy,
    },
  ],
})
export class WithdrawalSagaModule {}
