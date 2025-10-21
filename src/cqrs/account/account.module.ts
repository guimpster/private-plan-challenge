import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAccountByIdHandler } from './queries/query-handlers';
import { PrivatePlanAccountService } from 'src/business/domain/services/private-plan-account.service';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { InMemoryPrivatePlanModule } from 'src/repository/in-memory/in-memory-private-plan-account.module';

@Module({
  imports: [CqrsModule, InMemoryPrivatePlanModule],
  providers: [
    GetAccountByIdHandler,
    PrivatePlanAccountService,
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  exports: [CqrsModule, PrivatePlanAccountService],
})
export class AccountCqrsModule {}
