import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CommandBus } from '@nestjs/cqrs';
import { ProcessDepositsForReleaseCommand } from '../cqrs/deposit/commands/commands';

@Injectable()
export class DepositReleaseJob {
  private readonly logger = new Logger(DepositReleaseJob.name);

  constructor(
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Daily job that runs at 2:00 AM to process deposits due for release
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async processDepositsForRelease(): Promise<void> {
    this.logger.log('🚀 Starting daily deposit release job');

    try {
      const today = new Date();
      await this.commandBus.execute(new ProcessDepositsForReleaseCommand(today));
      
      this.logger.log('✅ Daily deposit release job completed successfully');
    } catch (error) {
      this.logger.error('❌ Daily deposit release job failed:', error.message);
    }
  }

  /**
   * Manual trigger for testing purposes
   */
  async processDepositsForDate(date: Date): Promise<void> {
    this.logger.log(`🔧 Manual trigger: Processing deposits for date ${date.toISOString().split('T')[0]}`);
    
    try {
      await this.commandBus.execute(new ProcessDepositsForReleaseCommand(date));
      this.logger.log('✅ Manual deposit processing completed successfully');
    } catch (error) {
      this.logger.error('❌ Manual deposit processing failed:', error.message);
    }
  }
}
