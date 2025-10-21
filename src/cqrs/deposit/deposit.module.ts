import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ProcessDepositsForReleaseHandler, SetupTestDataHandler, GetTestDepositsHandler } from './commands/command-handlers';
import { InMemoryPrivatePlanModule } from '../../repository/in-memory/in-memory-private-plan-account.module';
import { PrivatePlanDepositService } from '../../business/domain/services/private-plan-deposit.service';
import { PrivatePlanDepositRepository } from '../../business/repository/private-plan-deposit.repository';
import { InMemoryPrivatePlanDepositRepository } from '../../repository/in-memory/in-memory-private-plan-deposit.repository';
import { PrivatePlanAccountRepository } from '../../business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from '../../repository/in-memory/in-memory-private-plan-account.repository';

@Module({
  imports: [CqrsModule, InMemoryPrivatePlanModule],
  providers: [
    ProcessDepositsForReleaseHandler,
    SetupTestDataHandler,
    GetTestDepositsHandler,
    PrivatePlanDepositService,
    {
      provide: PrivatePlanDepositRepository,
      useExisting: InMemoryPrivatePlanDepositRepository,
    },
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  exports: [ProcessDepositsForReleaseHandler, SetupTestDataHandler, GetTestDepositsHandler],
})
export class DepositCqrsModule {}
