import { IEvent } from '@nestjs/cqrs';

export class WithdrawalSentToBankEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly bankAccountId: string,
    public readonly amount: number,
    public readonly sentAt: Date
  ) {}
}
