import { Withdrawal } from '../entities/withdrawal.entity';

export abstract class WithdrawalRepository {
  abstract create(withdrawal: Withdrawal): Promise<Withdrawal>;
  abstract updateById(withdrawalId: string, withdrawal: Withdrawal): Promise<Withdrawal>;
}
