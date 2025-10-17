import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AccountModule } from './api/account/account.module';
import { WithdrawalModule } from './api/withdrawal/withdrawal.module';

@Module({
  imports: [
    AccountModule,
    WithdrawalModule,
    ConfigModule.register({ type: 'json' }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
