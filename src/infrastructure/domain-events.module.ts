import { Module, OnModuleInit } from '@nestjs/common';
import { DomainEventDispatcher } from '../business/domain/events/domain-events';
import { AccountDebitedEvent, AccountCreditedEvent, InsufficientFundsEvent } from '../business/domain/events/account-events';
import { 
  AccountDebitedEventHandler, 
  AccountCreditedEventHandler, 
  InsufficientFundsEventHandler 
} from './event-handlers/account-event-handlers';

@Module({
  providers: [
    AccountDebitedEventHandler,
    AccountCreditedEventHandler,
    InsufficientFundsEventHandler,
  ],
})
export class DomainEventsModule implements OnModuleInit {
  constructor(
    private readonly accountDebitedHandler: AccountDebitedEventHandler,
    private readonly accountCreditedHandler: AccountCreditedEventHandler,
    private readonly insufficientFundsHandler: InsufficientFundsEventHandler,
  ) {}

  onModuleInit() {
    // Register domain event handlers
    DomainEventDispatcher.register(AccountDebitedEvent, this.accountDebitedHandler);
    DomainEventDispatcher.register(AccountCreditedEvent, this.accountCreditedHandler);
    DomainEventDispatcher.register(InsufficientFundsEvent, this.insufficientFundsHandler);
  }
}
