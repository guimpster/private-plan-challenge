import { Module } from '@nestjs/common';
import { InMemoryPrivatePlanAccountRepository } from './in-memory-private-plan-account.repository';
import { InMemoryDbModule } from './db/in-memory-db';
import { InMemoryPrivatePlanWithdrawalRepository } from './in-memory-private-plan-withdrawal.repository';


@Module({
  imports: [
    InMemoryDbModule.forRoot(),
  ],
  providers: [InMemoryPrivatePlanAccountRepository, InMemoryPrivatePlanWithdrawalRepository],
  exports: [InMemoryPrivatePlanAccountRepository, InMemoryPrivatePlanWithdrawalRepository],
})
export class InMemoryPrivatePlanModule {}
