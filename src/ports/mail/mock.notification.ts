import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../../business/domain/services/notification.service';
import { BusinessError } from '../../business/errors/errors';
import { PrivatePlanWithdrawalRepository } from '../../business/repository/private-plan-withdrawal.repository';

@Injectable()
export class MockNotificationService extends NotificationService {
  private readonly logger = new Logger(MockNotificationService.name);

  constructor(
    private readonly withdrawalRepository: PrivatePlanWithdrawalRepository
  ) {
    super();
  }

  async notifyUserOfSuccess(userId: string, accountId: string, withdrawalId: string): Promise<void> {
    this.logger.log(`Success notification sent to user ${userId} for withdrawal ${withdrawalId} from account ${accountId}`);
    
    // Record the notification in the withdrawal entity
    await this.recordNotification(userId, accountId, withdrawalId, 'SUCCESS', 
      `Withdrawal of ${withdrawalId} has been completed successfully. The funds have been transferred to your bank account.`);
  }

  async notifyUserOfFailure(userId: string, accountId: string, withdrawalId: string, error: BusinessError): Promise<void> {
    this.logger.warn(`Failure notification sent to user ${userId} for withdrawal ${withdrawalId} from account ${accountId}. Error: ${error.message}`);
    
    // Record the notification in the withdrawal entity
    await this.recordNotification(userId, accountId, withdrawalId, 'FAILURE', 
      `Withdrawal of ${withdrawalId} has failed. Reason: ${error.message}. Please contact support if you need assistance.`);
  }

  private async recordNotification(
    userId: string, 
    accountId: string, 
    withdrawalId: string, 
    type: 'SUCCESS' | 'FAILURE', 
    message: string
  ): Promise<void> {
    try {
      const withdrawal = await this.withdrawalRepository.getById(userId, accountId, withdrawalId);
      
      if (!withdrawal) {
        this.logger.error(`Withdrawal ${withdrawalId} not found for user ${userId} and account ${accountId}`);
        return;
      }

      // Add the notification to the withdrawal's notifications array
      const notification = {
        type,
        message,
        sentAt: new Date(),
        userId
      };

      const updatedNotifications = [...(withdrawal.notifications || []), notification];

      // Update the withdrawal with the new notification
      await this.withdrawalRepository.updateById(userId, accountId, withdrawalId, {
        notifications: updatedNotifications,
        updated_at: new Date()
      });

      this.logger.log(`Notification recorded for withdrawal ${withdrawalId}: ${type}`);
    } catch (error) {
      this.logger.error(`Failed to record notification for withdrawal ${withdrawalId}:`, error.message);
    }
  }
}
