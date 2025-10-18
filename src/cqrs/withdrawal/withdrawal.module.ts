import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as CommandHandlers from './command-handlers';
import { PrivatePlanWithdrawalService } from 'src/business/domain/services/private-plan-withdrawal.service';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { PrivatePlanWithdrawalRepository } from 'src/business/repository/private-plan-withdrawal.repository';
import { InMemoryPrivatePlanWithdrawalRepository } from 'src/repository/in-memory/in-memory-private-plan-withdrawal.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [
    ...Object.values(CommandHandlers).filter(v => typeof v === 'function'),
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