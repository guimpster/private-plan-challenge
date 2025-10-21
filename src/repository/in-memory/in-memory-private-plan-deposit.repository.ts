import { Inject, Injectable } from '@nestjs/common';
import { PrivatePlanDepositRepository } from '../../business/repository/private-plan-deposit.repository';
import { PrivatePlanDeposit } from '../../business/domain/entities/private-plan-deposit';
import { IN_MEMORY_DB } from '../../infrastructure/db/in-memory/in-memory-db';
import type { DBData } from '../../infrastructure/db/in-memory/in-memory-db.entity';

@Injectable()
export class InMemoryPrivatePlanDepositRepository extends PrivatePlanDepositRepository {
  constructor(@Inject(IN_MEMORY_DB) private readonly db: DBData) {
    super();
  }

  private get deposits(): PrivatePlanDeposit[] {
    // Get all deposits from all accounts
    const allDeposits: PrivatePlanDeposit[] = [];
    for (const user of this.db.users) {
      for (const account of user.accounts) {
        if (account.deposits) {
          allDeposits.push(...account.deposits);
        }
      }
    }
    return allDeposits;
  }

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

  async updateDeposit(id: string, depositUpdate: Partial<PrivatePlanDeposit>): Promise<PrivatePlanDeposit | undefined> {
    // Find the deposit in the JSON data structure
    for (const user of this.db.users) {
      for (const account of user.accounts) {
        if (account.deposits) {
          const depositIndex = account.deposits.findIndex(d => d.id === id);
          if (depositIndex !== -1) {
            account.deposits[depositIndex] = {
              ...account.deposits[depositIndex],
              ...depositUpdate,
              updated_at: new Date()
            };
            return account.deposits[depositIndex];
          }
        }
      }
    }
    return undefined;
  }

  async getDepositsByAccountId(accountId: string): Promise<PrivatePlanDeposit[]> {
    return this.deposits.filter(deposit => deposit.destinationPrivatePlanAccountId === accountId);
  }

  async createDeposit(deposit: PrivatePlanDeposit): Promise<PrivatePlanDeposit> {
    // Find the account and add the deposit to it
    for (const user of this.db.users) {
      for (const account of user.accounts) {
        if (account.id === deposit.destinationPrivatePlanAccountId) {
          if (!account.deposits) {
            account.deposits = [];
          }
          account.deposits.push(deposit);
          return deposit;
        }
      }
    }
    throw new Error(`Account ${deposit.destinationPrivatePlanAccountId} not found`);
  }

  // Helper method to add test deposits (for development/testing)
  addDeposit(deposit: PrivatePlanDeposit): void {
    // Find the account and add the deposit to it
    for (const user of this.db.users) {
      for (const account of user.accounts) {
        if (account.id === deposit.destinationPrivatePlanAccountId) {
          if (!account.deposits) {
            account.deposits = [];
          }
          account.deposits.push(deposit);
          return;
        }
      }
    }
    throw new Error(`Account ${deposit.destinationPrivatePlanAccountId} not found`);
  }

  // Helper method to get all deposits (for testing)
  getAllDeposits(): PrivatePlanDeposit[] {
    return this.deposits;
  }
}
