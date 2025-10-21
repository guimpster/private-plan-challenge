import { Module } from '@nestjs/common';
import { InMemoryPrivatePlanAccountRepository } from './in-memory-private-plan-account.repository';
import { InMemoryDbModule } from '../../infrastructure/db/in-memory/in-memory-db';
import { InMemoryPrivatePlanWithdrawalRepository } from './in-memory-private-plan-withdrawal.repository';
import { InMemoryPrivatePlanDepositRepository } from './in-memory-private-plan-deposit.repository';


@Module({
  imports: [
    InMemoryDbModule.forRoot(),
  ],
  providers: [
    InMemoryPrivatePlanAccountRepository, 
    InMemoryPrivatePlanWithdrawalRepository,
    InMemoryPrivatePlanDepositRepository,
  ],
  exports: [
    InMemoryPrivatePlanAccountRepository, 
    InMemoryPrivatePlanWithdrawalRepository,
    InMemoryPrivatePlanDepositRepository,
  ],
})
export class InMemoryPrivatePlanModule {}
