import { IEvent } from '@nestjs/cqrs';

export class BankTransferCompletedEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly transactionId: string,
    public readonly completedAt: Date
  ) {}
}
