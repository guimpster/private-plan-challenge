import { BaseEntity } from 'src/business/common/base-entity';

export class AccountDto extends BaseEntity {
  id: string;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  created_at: Date;
  updated_at: Date;
}
