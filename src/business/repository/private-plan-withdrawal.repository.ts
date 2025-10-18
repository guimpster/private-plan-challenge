import { PrivatePlanWithdrawal } from '../entities/private-plan-withdrawal';


export abstract class PrivatePlanWithdrawalRepository {
  abstract create(userId: string, accountId: string, privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal>;
  abstract updateById(userId: string, accountId: string, id: string, privatePlanWithdrawal: Partial<PrivatePlanWithdrawal>): Promise<PrivatePlanWithdrawal>;
  abstract getById(userId: string, accountId: string, id: string): Promise<PrivatePlanWithdrawal | undefined>;
}
