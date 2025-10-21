import { IEvent } from '@nestjs/cqrs';

export class WithdrawalFailedEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly reason: string,
    public readonly failedAt: Date
  ) {}
}
