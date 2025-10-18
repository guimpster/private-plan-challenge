import { Injectable, Logger } from '@nestjs/common';
import { DomainEventHandler } from '../../business/domain/domain-events';
import { AccountDebitedEvent, AccountCreditedEvent, InsufficientFundsEvent } from '../../business/domain/account-events';

@Injectable()
export class AccountDebitedEventHandler implements DomainEventHandler<AccountDebitedEvent> {
  private readonly logger = new Logger(AccountDebitedEventHandler.name);

  async handle(event: AccountDebitedEvent): Promise<void> {
    this.logger.log(`Account ${event.accountId} debited ${event.amount} for withdrawal ${event.withdrawalId}`);
    // Here you could add audit logging, notifications, etc.
  }
}

@Injectable()
export class AccountCreditedEventHandler implements DomainEventHandler<AccountCreditedEvent> {
  private readonly logger = new Logger(AccountCreditedEventHandler.name);

  async handle(event: AccountCreditedEvent): Promise<void> {
    this.logger.log(`Account ${event.accountId} credited ${event.amount}. Reason: ${event.reason}`);
    // Here you could add audit logging, notifications, etc.
  }
}

@Injectable()
export class InsufficientFundsEventHandler implements DomainEventHandler<InsufficientFundsEvent> {
  private readonly logger = new Logger(InsufficientFundsEventHandler.name);

  async handle(event: InsufficientFundsEvent): Promise<void> {
    this.logger.warn(`Insufficient funds for account ${event.accountId}. Available: ${event.availableAmount}, Requested: ${event.requestedAmount}`);
    // Here you could add fraud detection, notifications, etc.
  }
}
