import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { RecordNotificationCommand } from './record-notification.command';
import { PrivatePlanWithdrawalRepository } from '../../../business/repository/private-plan-withdrawal.repository';

@CommandHandler(RecordNotificationCommand)
export class RecordNotificationHandler implements ICommandHandler<RecordNotificationCommand> {
  private readonly logger = new Logger(RecordNotificationHandler.name);

  constructor(
    private readonly withdrawalRepository: PrivatePlanWithdrawalRepository
  ) {}

  async execute(command: RecordNotificationCommand): Promise<void> {
    const { userId, accountId, withdrawalId, type, message } = command;

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
