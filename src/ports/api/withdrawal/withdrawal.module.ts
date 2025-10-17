import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';
import { InMemoryPrivatePlanModule } from 'src/repository/in-memory/in-memory-private-plan-account.module';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { PrivatePlanWithdrawalService } from 'src/business/service/private-plan-withdrawal.service';
import { PrivatePlanWithdrawalRepository } from 'src/business/repository/private-plan-withdrawal.repository';
import { InMemoryPrivatePlanWithdrawalRepository } from 'src/repository/in-memory/in-memory-private-plan-withdrawal.repository';

@Module({
  imports: [InMemoryPrivatePlanModule],
  providers: [
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
  controllers: [WithdrawalController],
})
export class WithdrawalModule {}
