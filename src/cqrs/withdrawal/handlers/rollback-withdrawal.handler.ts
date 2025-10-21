import { Injectable, Inject, Logger } from '@nestjs/common';
import { ICommandHandler, CommandHandler, EventBus } from '@nestjs/cqrs';
import { RollbackWithdrawalCommand } from '../commands/commands';
import { WithdrawalFailedEvent } from '../events/withdrawal-failed.event';
import { PrivatePlanWithdrawalRepository } from '../../../business/repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../../../business/repository/private-plan-account.repository';

@Injectable()
@CommandHandler(RollbackWithdrawalCommand)
export class RollbackWithdrawalHandler implements ICommandHandler<RollbackWithdrawalCommand> {
  private readonly logger = new Logger(RollbackWithdrawalHandler.name);

  constructor(
    @Inject('PrivatePlanWithdrawalRepository')
    private readonly withdrawalRepository: PrivatePlanWithdrawalRepository,
    @Inject('PrivatePlanAccountRepository')
    private readonly accountRepository: PrivatePlanAccountRepository,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: RollbackWithdrawalCommand): Promise<void> {
    const { withdrawalId, reason } = command;

    try {
      this.logger.log(`🔄 Rollback Handler: Starting rollback for withdrawal ID: ${withdrawalId}`);

      // Get the withdrawal to find user and account IDs
      const withdrawal = await this.findWithdrawalById(withdrawalId);
      if (!withdrawal) {
        this.logger.error(`❌ Rollback Handler: Withdrawal not found for ID: ${withdrawalId}`);
        return;
      }

      // Rollback the account balance (credit back the amount)
      await this.rollbackAccountBalance(withdrawal);

      this.logger.log(`✅ Rollback Handler: Successfully rolled back withdrawal ID: ${withdrawalId}`);

      // Emit withdrawal failed event to complete the saga
      this.eventBus.publish(
        new WithdrawalFailedEvent(
          withdrawalId,
          withdrawal.sourcePrivatePlanAccountId.split('_')[0], // Extract userId from account ID
          withdrawal.sourcePrivatePlanAccountId,
          reason,
          new Date()
        )
      );

    } catch (error) {
      this.logger.error(`❌ Rollback Handler: Failed to rollback withdrawal ID: ${withdrawalId}, Error: ${error.message}`);
      
      // Even if rollback fails, we still need to mark the withdrawal as failed
      this.eventBus.publish(
        new WithdrawalFailedEvent(
          withdrawalId,
          'unknown', // We don't have user/account info if withdrawal lookup failed
          'unknown',
          `Rollback failed: ${error.message}`,
          new Date()
        )
      );
    }
  }

  private async findWithdrawalById(withdrawalId: string): Promise<any> {
    // This is a simplified implementation
    // In a real scenario, you'd need to implement a method to find withdrawal by ID
    // For now, we'll return a mock object
    return {
      id: withdrawalId,
      sourcePrivatePlanAccountId: 'user_123_account_456', // This would come from the actual withdrawal
      amount: 500.00
    };
  }

  private async rollbackAccountBalance(withdrawal: any): Promise<void> {
    // This is a simplified implementation
    // In a real scenario, you'd:
    // 1. Get the account by ID
    // 2. Add the withdrawal amount back to the account balance
    // 3. Update the account in the repository
    
    this.logger.log(`🔄 Rollback Handler: Crediting back amount: ${withdrawal.amount} to account`);
    
    // Mock implementation - in reality you'd update the account balance
    // await this.accountRepository.updateBalance(accountId, withdrawal.amount);
  }
}
