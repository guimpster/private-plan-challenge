import { Source } from "./source.entity";

export enum PrivatePlanWithdrawalStep {
  CREATED = 'CREATED',
  DEBITING = 'DEBITING',
  SENDING_TO_BANK = 'SENDING_TO_BANK',
  ROLLING_BACK = 'ROLLING_BACK',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
}

export enum BankTransferStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum NotificationDeliveryState {
  PENDING = 'PENDING',
  SENT = 'SENT',
  RETRYING = 'RETRYING',
  FAILED = 'FAILED',
}

export class PrivatePlanWithdrawal {
  id: string;
  sourcePrivatePlanAccountId: string;
  sourceTransactionId: string;
  destinationBankAccountId: string;
  destinationTransactionId: string;
  bankStatus: BankTransferStatus;
  bankAttemptCount: number;
  notifySuccessState: NotificationDeliveryState;
  notifyFailureState: NotificationDeliveryState;
  notifyAttemptCount: number;
  nextRetryAt?: Date;
  lastError?: string;
  processed: boolean;
  sentToDestination: boolean;
  userCredited: boolean;
  amount: number;
  cancelRequested: boolean;
  canceled: boolean;
  comment: string;
  source: Source;
  step: PrivatePlanWithdrawalStep;
  stepRetrialCount: number;
  stepHistory: { step: PrivatePlanWithdrawalStep; stepRetrialCount: number; at: Date }[];
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<PrivatePlanWithdrawal>) {
    Object.assign(this, { step: PrivatePlanWithdrawalStep.CREATED }, partial);
  }
}
