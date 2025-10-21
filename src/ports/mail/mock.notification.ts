import { Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { NotificationService } from '../../business/domain/services/notification.service';
import { BusinessError } from '../../business/errors/errors';
import { RecordNotificationCommand } from '../../cqrs/withdrawal/commands/commands';

@Injectable()
export class MockNotificationService extends NotificationService {
  private readonly logger = new Logger(MockNotificationService.name);

  constructor(
    private readonly commandBus: CommandBus
  ) {
    super();
  }

  async notifyUserOfSuccess(userId: string, accountId: string, withdrawalId: string): Promise<void> {
    this.logger.log(`Success notification sent to user ${userId} for withdrawal ${withdrawalId} from account ${accountId}`);
    
    // Record the notification using CommandBus
    await this.commandBus.execute(
      new RecordNotificationCommand(
        userId,
        accountId,
        withdrawalId,
        'SUCCESS',
        `Withdrawal of ${withdrawalId} has been completed successfully. The funds have been transferred to your bank account.`
      )
    );
  }

  async notifyUserOfFailure(userId: string, accountId: string, withdrawalId: string, error: BusinessError): Promise<void> {
    this.logger.warn(`Failure notification sent to user ${userId} for withdrawal ${withdrawalId} from account ${accountId}. Error: ${error.message}`);
    
    // Record the notification using CommandBus
    await this.commandBus.execute(
      new RecordNotificationCommand(
        userId,
        accountId,
        withdrawalId,
        'FAILURE',
        `Withdrawal of ${withdrawalId} has failed. Reason: ${error.message}. Please contact support if you need assistance.`
      )
    );
  }

}
