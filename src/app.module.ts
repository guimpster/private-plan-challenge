import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AccountModule } from './ports/api/account/account.module';
import { WithdrawalModule } from './ports/api/withdrawal/withdrawal.module';
import { BradescoWebHookModule } from './ports/webhooks/banks/bradesco/bradesco.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { DomainEventsModule } from './infrastructure/domain-events.module';

@Module({
  imports: [
    ConfigModule.register({ type: 'json' }),
    InfrastructureModule,
    DomainEventsModule,
    BradescoWebHookModule,
    AccountModule,
    WithdrawalModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
