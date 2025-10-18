import { BaseEntity } from 'src/business/common/base-entity';

export class WithdrawalResponseDto extends BaseEntity {
  id: string;
  userId: string;
  accountId: string;
  bankAccountId: string;
  amount: number;
  status: string;
  created_at: Date;
}
