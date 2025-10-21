import { IEvent } from '@nestjs/cqrs';

export class BankResponseReceivedEvent implements IEvent {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly bankTransactionId: string,
    public readonly status: 'SUCCESS' | 'FAILURE',
    public readonly responseCode: string,
    public readonly responseMessage: string,
    public readonly receivedAt: Date
  ) {}
}
