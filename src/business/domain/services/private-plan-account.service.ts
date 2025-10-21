import { Injectable } from '@nestjs/common';
import { PrivatePlanAccount } from '../entities/private-plan-account';
import { PrivatePlanAccountRepository } from '../../repository/private-plan-account.repository';
import { Money, AccountId, UserId } from '../value-objects/value-objects';

export interface GetAccountQuery {
  userId: string;
  accountId: string;
}

export interface DebitAccountCommand {
  userId: string;
  accountId: string;
  amount: number;
  withdrawalId: string;
}

export interface CreditAccountCommand {
  userId: string;
  accountId: string;
  amount: number;
  reason: string;
}

@Injectable()
export class PrivatePlanAccountService {
  constructor(private readonly privatePlanAccountRepository: PrivatePlanAccountRepository) {}

  // TODO: check if user is authenticated and has permissions
  async findByUserId(userId: string, id: string): Promise<PrivatePlanAccount | undefined> {
    return this.privatePlanAccountRepository.getByUserId(userId, id);
  }

  async getAccount(query: GetAccountQuery): Promise<PrivatePlanAccount | undefined> {
    const userId = new UserId(query.userId);
    const accountId = new AccountId(query.accountId);
    
    return this.findByUserId(userId.value, accountId.value);
  }

  async debitAccount(command: DebitAccountCommand): Promise<PrivatePlanAccount> {
    const userId = new UserId(command.userId);
    const accountId = new AccountId(command.accountId);
    const amount = new Money(command.amount);
    const withdrawalId = command.withdrawalId;

    const account = await this.findByUserId(userId.value, accountId.value);
    if (!account) {
      throw new Error(`Account ${accountId.value} not found for user ${userId.value}`);
    }

    const updatedAccount = await this.debitAccountInternal(account, amount.amount, withdrawalId);
    
    await this.privatePlanAccountRepository.updateByUserId(userId.value, accountId.value, updatedAccount);
    
    return updatedAccount;
  }

  async creditAccount(command: CreditAccountCommand): Promise<PrivatePlanAccount> {
    const userId = new UserId(command.userId);
    const accountId = new AccountId(command.accountId);
    const amount = new Money(command.amount);

    const account = await this.findByUserId(userId.value, accountId.value);
    if (!account) {
      throw new Error(`Account ${accountId.value} not found for user ${userId.value}`);
    }

    const updatedAccount = await this.creditAccountInternal(account, amount.amount, command.reason);
    
    await this.privatePlanAccountRepository.updateByUserId(userId.value, accountId.value, updatedAccount);
    
    return updatedAccount;
  }

  async checkAccountBalance(userId: string, accountId: string): Promise<number> {
    const account = await this.findByUserId(userId, accountId);
    if (!account) {
      throw new Error(`Account ${accountId} not found for user ${userId}`);
    }
    
    return this.calculateAvailableBalance(account);
  }

  private async debitAccountInternal(
    account: PrivatePlanAccount,
    amount: number,
    withdrawalId: string
  ): Promise<PrivatePlanAccount> {
    if (account.cashAvailableForWithdrawal < amount) {
      throw new Error(`Insufficient funds. Available: ${account.cashAvailableForWithdrawal}, Requested: ${amount}`);
    }

    const updatedAccount = new PrivatePlanAccount({
      ...account,
      cashAvailableForWithdrawal: account.cashAvailableForWithdrawal - amount,
      cashBalance: account.cashBalance - amount,
      updated_at: new Date()
    });

    return updatedAccount;
  }

  private async creditAccountInternal(
    account: PrivatePlanAccount,
    amount: number,
    reason: string
  ): Promise<PrivatePlanAccount> {
    const updatedAccount = new PrivatePlanAccount({
      ...account,
      cashAvailableForWithdrawal: account.cashAvailableForWithdrawal + amount,
      cashBalance: account.cashBalance + amount,
      updated_at: new Date()
    });

    return updatedAccount;
  }

  private canWithdraw(account: PrivatePlanAccount, amount: number): boolean {
    return account.cashAvailableForWithdrawal >= amount;
  }

  private calculateAvailableBalance(account: PrivatePlanAccount): number {
    return account.cashAvailableForWithdrawal;
  }
}
