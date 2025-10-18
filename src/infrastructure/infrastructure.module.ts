import { Module } from '@nestjs/common';
import { InMemoryPrivatePlanModule } from '../repository/in-memory/in-memory-private-plan-account.module';
import { BankService } from '../business/service/bank.service';
import { MockBankService } from './services/mock-bank.service';
import { NotificationService } from '../business/service/notification.service';
import { MockNotificationService } from './services/mock-notification.service';

@Module({
  imports: [InMemoryPrivatePlanModule],
  providers: [
    {
      provide: BankService,
      useClass: MockBankService,
    },
    {
      provide: NotificationService,
      useClass: MockNotificationService,
    },
  ],
  exports: [InMemoryPrivatePlanModule, BankService, NotificationService],
})
export class InfrastructureModule {}
