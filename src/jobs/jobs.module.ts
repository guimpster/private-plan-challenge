import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';
import { DepositReleaseJob } from './deposit-release.job';
import { DepositCqrsModule } from '../cqrs/deposit/deposit.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CqrsModule,
    DepositCqrsModule,
  ],
  providers: [
    DepositReleaseJob,
  ],
  exports: [DepositReleaseJob],
})
export class JobsModule {}

