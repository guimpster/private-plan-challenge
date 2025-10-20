import { BaseEntity } from 'src/business/common/base-entity';

export class AccountDto {
  id: string;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<AccountDto>) {
    Object.assign(this, partial);
  }
}
