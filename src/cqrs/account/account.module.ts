import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as QueryHandlers from './query-handlers';
import { AccountApplicationService } from 'src/business/domain/services/account-application-service';
import { PrivatePlanAccountService } from 'src/business/domain/services/private-plan-account.service';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';

@Module({
  imports: [CqrsModule, InfrastructureModule],
  providers: [
    ...Object.values(QueryHandlers).filter(v => typeof v === 'function'),
    AccountApplicationService,
    PrivatePlanAccountService,
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  exports: [CqrsModule, AccountApplicationService],
})
export class AccountCqrsModule {}
