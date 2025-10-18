import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { AccountCqrsModule } from 'src/cqrs/account/account.module';

@Module({
  imports: [AccountCqrsModule],
  controllers: [AccountController],
})
export class AccountModule {}
