export class DepositDto {
  id: string;
  amount: number; // Amount in cents (integer)
  userCredited: boolean;
  release_at: Date;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<DepositDto>) {
    Object.assign(this, partial);
  }
}

export class WithdrawalDto {
  id: string;
  amount: number; // Amount in cents (integer)
  step: string;
  stepHistory: any[];
  notifications: any[];
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<WithdrawalDto>) {
    Object.assign(this, partial);
  }
}

export class AccountDto {
  id: string;
  cashAvailableForWithdrawal: number; // Amount in cents (integer)
  cashBalance: number; // Amount in cents (integer)
  deposits: DepositDto[];
  withdrawals: WithdrawalDto[];
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<AccountDto>) {
    Object.assign(this, partial);
  }
}
