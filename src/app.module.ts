import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AccountModule } from './ports/api/account/account.module';
import { WithdrawalModule } from './ports/api/withdrawal/withdrawal.module';
import { BradescoWebHookModule } from './ports/webhooks/banks/bradesco/bradesco.module';

@Module({
  imports: [
    BradescoWebHookModule,
    AccountModule,
    WithdrawalModule,
    ConfigModule.register({ type: 'json' }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
