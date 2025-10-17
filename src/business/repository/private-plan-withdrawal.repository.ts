import { PrivatePlanWithdrawal } from '../entities/private-plan-withdrawal';

export abstract class PrivatePlanWithdrawalRepository {
  abstract create(privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal>;
  abstract updateById(id: string, privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal>;
}
