import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';
import { DepositReleaseJob } from './deposit-release.job';
import { TestDataSetup } from './test-data-setup';
import { PrivatePlanDepositService } from '../business/domain/services/private-plan-deposit.service';
import { PrivatePlanDepositRepository } from '../business/repository/private-plan-deposit.repository';
import { InMemoryPrivatePlanDepositRepository } from '../repository/in-memory/in-memory-private-plan-deposit.repository';
import { PrivatePlanAccountRepository } from '../business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from '../repository/in-memory/in-memory-private-plan-account.repository';
import { InMemoryPrivatePlanModule } from '../repository/in-memory/in-memory-private-plan-account.module';
import { DepositCqrsModule } from '../cqrs/deposit/deposit.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule,
    InMemoryPrivatePlanModule,
    DepositCqrsModule,
  ],
  providers: [
    DepositReleaseJob,
    TestDataSetup,
    PrivatePlanDepositService,
    {
      provide: PrivatePlanDepositRepository,
      useExisting: InMemoryPrivatePlanDepositRepository,
    },
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  exports: [DepositReleaseJob, PrivatePlanDepositService, TestDataSetup],
})
export class JobsModule {}

