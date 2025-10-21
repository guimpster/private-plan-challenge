import { IEvent } from '@nestjs/cqrs';

export class WithdrawalRollingBackEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly reason: string,
    public readonly rollingBackAt: Date
  ) {}
}
