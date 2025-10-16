export class Withdrawal {
  id: string;
  sourceAccountId: string;
  sourceTransactionId: string;
  destinationAccountId: string;
  destinationTransactionId: string;
  processed: boolean;
  sentToDestination: boolean;
  userCredited: boolean;
  amount: number;
  cancelRequested: boolean;
  canceled: boolean;
  comment: string;
  source: 'system' | 'whatsapp' | 'ops';
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<Withdrawal>) {
    Object.assign(this, partial);
  }
}
