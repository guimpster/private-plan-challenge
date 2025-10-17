import { PrivatePlanAccount } from "../entities/private-plan-account";

export abstract class PrivatePlanAccountRepository {
  abstract getByUserId(userId: string, id: string): Promise<PrivatePlanAccount | undefined>;
  abstract updateByUserId(userId: string, id: string, account: PrivatePlanAccount): Promise<PrivatePlanAccount | undefined>;
}
