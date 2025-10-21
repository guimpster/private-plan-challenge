import { Injectable, Logger } from '@nestjs/common';
import { PrivatePlanDepositRepository } from '../../repository/private-plan-deposit.repository';
import { PrivatePlanAccountRepository } from '../../repository/private-plan-account.repository';
import { PrivatePlanDeposit } from '../entities/private-plan-deposit';

@Injectable()
export class PrivatePlanDepositService {
  private readonly logger = new Logger(PrivatePlanDepositService.name);

  constructor(
    private readonly privatePlanDepositRepository: PrivatePlanDepositRepository,
    private readonly privatePlanAccountRepository: PrivatePlanAccountRepository,
  ) {}

  /**
   * Process deposits that are due for release on the given date
   */
  async processDepositsForRelease(releaseDate: Date): Promise<void> {
    this.logger.log(`🔄 Processing deposits for release date: ${releaseDate.toISOString().split('T')[0]}`);

    try {
      const depositsToProcess = await this.privatePlanDepositRepository.getDepositsForRelease(releaseDate);
      
      this.logger.log(`🔍 Repository returned ${depositsToProcess.length} deposits for processing`);
      
      if (depositsToProcess.length === 0) {
        this.logger.log(`✅ No deposits found for release date: ${releaseDate.toISOString().split('T')[0]}`);
        return;
      }

      this.logger.log(`📊 Found ${depositsToProcess.length} deposits to process`);

      let processedCount = 0;
      let errorCount = 0;

      for (const deposit of depositsToProcess) {
        try {
          await this.processDeposit(deposit);
          processedCount++;
          this.logger.log(`✅ Processed deposit ${deposit.id} for account ${deposit.destinationPrivatePlanAccountId}`);
        } catch (error) {
          errorCount++;
          this.logger.error(`❌ Failed to process deposit ${deposit.id}:`, error.message);
        }
      }

      this.logger.log(`🎯 Deposit processing completed: ${processedCount} processed, ${errorCount} errors`);
    } catch (error) {
      this.logger.error(`❌ Error processing deposits for release date ${releaseDate.toISOString().split('T')[0]}:`, error.message);
    }
  }

  /**
   * Process a single deposit by crediting it to the account
   */
  private async processDeposit(deposit: PrivatePlanDeposit): Promise<void> {
    const { userId, accountId, amount, id } = deposit;

    this.logger.log(`🔄 Processing deposit ${id} for user ${userId} and account ${accountId}`);

    // Get the account using the userId and accountId from the deposit
    const account = await this.privatePlanAccountRepository.getByUserId(userId, accountId);
    if (!account) {
      throw new Error(`Account ${accountId} not found for user ${userId}`);
    }

    this.logger.log(`📊 Found account ${accountId} with balance ${account.cashBalance}`);

    // Credit the account - only add to cashAvailableForWithdrawal since cashBalance already includes all deposits
    const updatedAccount = await this.privatePlanAccountRepository.updateByUserId(
      userId,
      accountId,
      {
        cashAvailableForWithdrawal: account.cashAvailableForWithdrawal + amount,
        updated_at: new Date()
      }
    );

    if (!updatedAccount) {
      throw new Error(`Failed to update account ${accountId}`);
    }

    // Mark deposit as credited
    await this.privatePlanDepositRepository.updateDeposit(id, {
      userCredited: true,
      updated_at: new Date()
    });

    this.logger.log(`💰 Credited ${amount} to account ${accountId}. New balance: ${updatedAccount.cashBalance}`);
  }

  /**
   * Create a new deposit and add it to the account's cash balance (but not available for withdrawal)
   */
  async createDeposit(deposit: PrivatePlanDeposit): Promise<PrivatePlanDeposit> {
    this.logger.log(`🔄 Creating deposit ${deposit.id} for user ${deposit.userId} and account ${deposit.accountId}`);

    // Get the account
    const account = await this.privatePlanAccountRepository.getByUserId(deposit.userId, deposit.accountId);
    if (!account) {
      throw new Error(`Account ${deposit.accountId} not found for user ${deposit.userId}`);
    }

    this.logger.log(`📊 Found account ${deposit.accountId} with balance ${account.cashBalance}`);

    // Add to cash balance only (not available for withdrawal until release date)
    const updatedAccount = await this.privatePlanAccountRepository.updateByUserId(
      deposit.userId,
      deposit.accountId,
      {
        cashBalance: account.cashBalance + deposit.amount,
        updated_at: new Date()
      }
    );

    if (!updatedAccount) {
      throw new Error(`Failed to update account ${deposit.accountId}`);
    }

    this.logger.log(`💰 Added ${deposit.amount} to account ${deposit.accountId} cash balance. New balance: ${updatedAccount.cashBalance}`);

    // Create the deposit record
    return this.privatePlanDepositRepository.createDeposit(deposit);
  }

  /**
   * Get deposits for a specific account
   */
  async getDepositsByAccountId(accountId: string): Promise<PrivatePlanDeposit[]> {
    return this.privatePlanDepositRepository.getDepositsByAccountId(accountId);
  }
}
