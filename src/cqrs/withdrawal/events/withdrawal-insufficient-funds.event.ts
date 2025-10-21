import { IEvent } from '@nestjs/cqrs';

export class WithdrawalInsufficientFundsEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly insufficientFundsAt: Date
  ) {}
}
