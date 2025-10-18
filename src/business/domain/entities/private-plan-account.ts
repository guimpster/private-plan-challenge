import { PrivatePlanDeposit } from "./private-plan-deposit";
import { Source } from './source'
import { PrivatePlanWithdrawal } from "./private-plan-withdrawal";
import { BaseEntity } from '../../common/base-entity';

export class PrivatePlanAccount extends BaseEntity {
  id: string;
  userId: string;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  source: Source;
  withdrawals: PrivatePlanWithdrawal[];
  deposits: PrivatePlanDeposit[];
  modality: 'VGBL' | 'PGBL';
  inactivated_at: Date | null;
  created_at: Date;
  updated_at: Date;
}
