import { IEvent } from '@nestjs/cqrs';

export class WithdrawalDebitedEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly bankAccountId: string,
    public readonly debitedAt: Date
  ) {}
}
