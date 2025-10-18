import { Result } from "../common";
import { PrivatePlanAccount } from "../entities/private-plan-account";
import { NotEnoughFunds } from "../errors/errors";

export abstract class PrivatePlanAccountRepository {
  abstract getByUserId(userId: string, id: string): Promise<PrivatePlanAccount | undefined>;
  abstract updateByUserId(userId: string, id: string, account: Partial<PrivatePlanAccount>): Promise<PrivatePlanAccount | undefined>;
  abstract checkAndDebitAccount(userId: string, id: string, amount: number): Promise<Result<PrivatePlanAccount, NotEnoughFunds>>;
  abstract creditFailedWithdrawal(userId: string, id: string, amount: number): Promise<PrivatePlanAccount | undefined>;
}
