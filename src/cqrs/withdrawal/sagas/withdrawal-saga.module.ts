import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WithdrawalSaga } from './withdrawal-saga';
import { WithdrawalStepHistoryService } from '../../../business/domain/services/withdrawal-step-history.service';
import { PrivatePlanWithdrawalRepository } from '../../../business/repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../../../business/repository/private-plan-account.repository';
import { RollbackWithdrawalHandler } from '../handlers/rollback-withdrawal.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    WithdrawalSaga,
    WithdrawalStepHistoryService,
    RollbackWithdrawalHandler,
    {
      provide: 'PrivatePlanWithdrawalRepository',
      useClass: PrivatePlanWithdrawalRepository
    },
    {
      provide: 'PrivatePlanAccountRepository',
      useClass: PrivatePlanAccountRepository
    }
  ],
})
export class WithdrawalSagaModule {}
