export class DepositDto {
  id: string;
  amount: number;
  userCredited: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<DepositDto>) {
    Object.assign(this, partial);
  }
}

export class WithdrawalDto {
  id: string;
  amount: number;
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
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  deposits: DepositDto[];
  withdrawals: WithdrawalDto[];
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<AccountDto>) {
    Object.assign(this, partial);
  }
}
