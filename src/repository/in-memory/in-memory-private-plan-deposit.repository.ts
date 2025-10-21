import { Injectable } from '@nestjs/common';
import { PrivatePlanDepositRepository } from '../../business/repository/private-plan-deposit.repository';
import { PrivatePlanDeposit } from '../../business/domain/entities/private-plan-deposit';

@Injectable()
export class InMemoryPrivatePlanDepositRepository extends PrivatePlanDepositRepository {
  private deposits: PrivatePlanDeposit[] = [];

  async getDepositsForRelease(releaseDate: Date): Promise<PrivatePlanDeposit[]> {
    const targetDate = new Date(releaseDate);
    targetDate.setHours(0, 0, 0, 0);

    return this.deposits.filter(deposit => {
      if (deposit.userCredited) {
        return false;
      }
      
      const depositReleaseDate = new Date(deposit.release_at);
      depositReleaseDate.setHours(0, 0, 0, 0);
      
      return depositReleaseDate.getTime() === targetDate.getTime();
    });
  }

  async updateDeposit(id: string, deposit: Partial<PrivatePlanDeposit>): Promise<PrivatePlanDeposit | undefined> {
    const index = this.deposits.findIndex(d => d.id === id);
    if (index === -1) return undefined;

    this.deposits[index] = {
      ...this.deposits[index],
      ...deposit,
      updated_at: new Date()
    };

    return this.deposits[index];
  }

  async getDepositsByAccountId(accountId: string): Promise<PrivatePlanDeposit[]> {
    return this.deposits.filter(deposit => deposit.destinationPrivatePlanAccountId === accountId);
  }

  // Helper method to add test deposits (for development/testing)
  addDeposit(deposit: PrivatePlanDeposit): void {
    this.deposits.push(deposit);
  }

  // Helper method to get all deposits (for testing)
  getAllDeposits(): PrivatePlanDeposit[] {
    return [...this.deposits];
  }
}
