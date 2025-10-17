import { Source } from "./source.entity";

export class PrivatePlanWithdrawal {
  id: string;
  sourcePrivatePlanAccountId: string;
  sourceTransactionId: string;
  destinationBankAccountId: string;
  destinationTransactionId: string;
  processed: boolean;
  sentToDestination: boolean;
  userCredited: boolean;
  amount: number;
  cancelRequested: boolean;
  canceled: boolean;
  comment: string;
  source: Source;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<PrivatePlanWithdrawal>) {
    Object.assign(this, partial);
  }
}
