import { Source } from "./source";
import { BaseEntity } from "../../common/base-entity";

export enum PrivatePlanWithdrawalStep {
  CREATED = 'CREATED',
  DEBITING = 'DEBITING',
  SENDING_TO_BANK = 'SENDING_TO_BANK',
  RECEIVED_BANK_RESPONSE = 'RECEIVED_BANK_RESPONSE',
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

export class PrivatePlanWithdrawal extends BaseEntity {
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
  notifications: { type: 'SUCCESS' | 'FAILURE'; message: string; sentAt: Date; userId: string }[];
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<PrivatePlanWithdrawal>) {
    super();
    // Set default values first
    this.step = PrivatePlanWithdrawalStep.CREATED;
    this.notifications = [];
    // Then assign all other properties
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
