import { PrivatePlanDeposit } from "../domain/entities/private-plan-deposit";

export abstract class PrivatePlanDepositRepository {
  abstract getDepositsForRelease(releaseDate: Date): Promise<PrivatePlanDeposit[]>;
  abstract updateDeposit(id: string, deposit: Partial<PrivatePlanDeposit>): Promise<PrivatePlanDeposit | undefined>;
  abstract getDepositsByAccountId(accountId: string): Promise<PrivatePlanDeposit[]>;
}
