import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { InMemoryPrivatePlanModule } from 'src/repository/in-memory/in-memory-private-plan-account.module';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from 'src/repository/in-memory/in-memory-private-plan-account.repository';
import { PrivatePlanAccountService } from 'src/business/service/private-plan-account.service';

@Module({
  imports: [InMemoryPrivatePlanModule],
  providers: [
    PrivatePlanAccountService,
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  controllers: [AccountController],
})
export class AccountModule {}
