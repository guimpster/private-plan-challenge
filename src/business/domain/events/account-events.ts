import { DomainEvent } from './domain-events';

export class AccountDebitedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly withdrawalId: string
  ) {
    super();
  }
}

export class AccountCreditedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly reason: string
  ) {
    super();
  }
}

export class AccountCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly modality: 'VGBL' | 'PGBL'
  ) {
    super();
  }
}

export class InsufficientFundsEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly requestedAmount: number,
    public readonly availableAmount: number
  ) {
    super();
  }
}
