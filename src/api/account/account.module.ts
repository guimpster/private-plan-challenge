import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { InMemoryModule } from 'src/repository/in-memory/in-memory.module';
import { AccountRepository } from 'src/business/repository/account.repository';
import { InMemoryAccountRepository } from 'src/repository/in-memory/in-memory.account.repository';
import { AccountService } from 'src/business/service/account/account.service';

@Module({
  imports: [InMemoryModule],
  providers: [
    AccountService,
    {
      provide: AccountRepository,
      useExisting: InMemoryAccountRepository,
    },
  ],
  controllers: [AccountController],
})
export class AccountModule {}
