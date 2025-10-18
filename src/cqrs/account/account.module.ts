import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as QueryHandlers from './query-handlers';
import { PrivatePlanAccountService } from 'src/business/service/private-plan-account.service';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { InMemoryPrivatePlanModule } from 'src/repository/in-memory/in-memory-private-plan-account.module';

@Module({
  imports: [CqrsModule, InMemoryPrivatePlanModule],
  providers: [
    ...Object.values(QueryHandlers).filter(v => typeof v === 'function'),
    PrivatePlanAccountService,
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  exports: [PrivatePlanAccountService],
})
export class AccountCqrsModule {}
