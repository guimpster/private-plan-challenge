import { PrivatePlanDeposit } from "./private-plan-deposit";
import { Source } from './source.entity'
import { PrivatePlanWithdrawal } from "./private-plan-withdrawal";

export class PrivatePlanAccount {
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

  constructor(partial: Partial<PrivatePlanAccount>) {
    Object.assign(this, partial);
  }
}
