import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { DepositReleaseJob } from '../../../jobs/deposit-release.job';
import { TestDataSetup } from '../../../jobs/test-data-setup';

@Controller('api/v1/jobs')
export class JobsController {
  private readonly logger = new Logger(JobsController.name);

  constructor(
    private readonly depositReleaseJob: DepositReleaseJob,
    private readonly testDataSetup: TestDataSetup,
  ) {}

  /**
   * Manually trigger the deposit release job for a specific date
   * This endpoint is useful for testing purposes
   */
  @Post('deposit-release')
  async triggerDepositRelease(@Body() body: { date?: string }): Promise<{ message: string; date: string }> {
    const date = body.date ? new Date(body.date) : new Date();
    
    this.logger.log(`🔧 Manual trigger requested for deposit release job on ${date.toISOString().split('T')[0]}`);
    
    try {
      await this.depositReleaseJob.processDepositsForDate(date);
      
      return {
        message: 'Deposit release job completed successfully',
        date: date.toISOString().split('T')[0]
      };
    } catch (error) {
      this.logger.error('❌ Manual deposit release job failed:', error.message);
      throw error;
    }
  }

  /**
   * Setup test deposits for testing the daily job
   */
  @Post('setup-test-data')
  async setupTestData(): Promise<{ message: string; depositsCount: number }> {
    this.logger.log('🔧 Setting up test data for deposit release job');
    
    try {
      this.testDataSetup.setupTestDeposits();
      const deposits = this.testDataSetup.getAllTestDeposits();
      
      return {
        message: 'Test data setup completed successfully',
        depositsCount: deposits.length
      };
    } catch (error) {
      this.logger.error('❌ Test data setup failed:', error.message);
      throw error;
    }
  }

  /**
   * Get all test deposits
   */
  @Get('test-deposits')
  async getTestDeposits(): Promise<any[]> {
    this.logger.log('📊 Retrieving test deposits');
    
    try {
      const deposits = this.testDataSetup.getAllTestDeposits();
      return deposits.map(deposit => ({
        id: deposit.id,
        userId: deposit.userId,
        accountId: deposit.accountId,
        amount: deposit.amount,
        release_at: deposit.release_at,
        userCredited: deposit.userCredited,
        destinationAccountId: deposit.destinationPrivatePlanAccountId,
        comment: deposit.comment
      }));
    } catch (error) {
      this.logger.error('❌ Failed to retrieve test deposits:', error.message);
      throw error;
    }
  }
}
