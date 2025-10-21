import { Module } from '@nestjs/common';
import { InMemoryPrivatePlanModule } from '../repository/in-memory/in-memory-private-plan-account.module';
import { BankService } from '../business/domain/services/bank.service';
import { BradescoProxy } from '../ports/proxy/bradesco.proxy';
import { NotificationService } from '../business/domain/services/notification.service';
import { MockNotificationService } from '../ports/mail/mock.notification';
import { PrivatePlanWithdrawalRepository } from '../business/repository/private-plan-withdrawal.repository';
import { InMemoryPrivatePlanWithdrawalRepository } from '../repository/in-memory/in-memory-private-plan-withdrawal.repository';

@Module({
  imports: [InMemoryPrivatePlanModule],
  providers: [
    {
      provide: BankService,
      useClass: BradescoProxy,
    },
    {
      provide: NotificationService,
      useClass: MockNotificationService,
    },
    {
      provide: PrivatePlanWithdrawalRepository,
      useExisting: InMemoryPrivatePlanWithdrawalRepository,
    },
  ],
  exports: [InMemoryPrivatePlanModule, BankService, NotificationService],
})
export class InfrastructureModule {}
