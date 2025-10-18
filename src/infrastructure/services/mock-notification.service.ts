import { Injectable, Logger } from '@nestjs/common';
import { NotificationService } from '../../business/service/notification.service';
import { BusinessError } from '../../business/errors/errors';

@Injectable()
export class MockNotificationService extends NotificationService {
  private readonly logger = new Logger(MockNotificationService.name);

  async notifyUserOfSuccess(userId: string, accountId: string, withdrawalId: string): Promise<void> {
    this.logger.log(`Success notification sent to user ${userId} for withdrawal ${withdrawalId} from account ${accountId}`);
    // In a real implementation, this would send email, SMS, push notification, etc.
  }

  async notifyUserOfFailure(userId: string, accountId: string, withdrawalId: string, error: BusinessError): Promise<void> {
    this.logger.warn(`Failure notification sent to user ${userId} for withdrawal ${withdrawalId} from account ${accountId}. Error: ${error.message}`);
    // In a real implementation, this would send email, SMS, push notification, etc.
  }
}
