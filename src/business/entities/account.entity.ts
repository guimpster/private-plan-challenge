export class Account {
  id: string;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  source: 'system' | 'whatsapp';
  inactivated_at: Date | null;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<Account>) {
    Object.assign(this, partial);
  }
}
