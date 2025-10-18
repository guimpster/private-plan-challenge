import { Injectable } from '@nestjs/common';
import { PrivatePlanAccount } from '../../business/domain/entities/private-plan-account';
import { PrivatePlanAccountRepository } from '../../business/repository/private-plan-account.repository';
import { AccountDomainService } from '../../business/domain/services/account-domain-service';
import { Money, AccountId, UserId } from '../../business/domain/value-objects/value-objects';

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
export class AccountApplicationService {
  constructor(
    private readonly accountRepository: PrivatePlanAccountRepository
  ) {}

  async getAccount(query: GetAccountQuery): Promise<PrivatePlanAccount | undefined> {
    const userId = new UserId(query.userId);
    const accountId = new AccountId(query.accountId);
    
    return this.accountRepository.getByUserId(userId.value, accountId.value);
  }

  async debitAccount(command: DebitAccountCommand): Promise<PrivatePlanAccount> {
    const userId = new UserId(command.userId);
    const accountId = new AccountId(command.accountId);
    const amount = new Money(command.amount);
    const withdrawalId = command.withdrawalId;

    const account = await this.accountRepository.getByUserId(userId.value, accountId.value);
    if (!account) {
      throw new Error(`Account ${accountId.value} not found for user ${userId.value}`);
    }

    const updatedAccount = await AccountDomainService.debitAccount(account, amount.amount, withdrawalId);
    
    await this.accountRepository.updateByUserId(userId.value, accountId.value, updatedAccount);
    
    return updatedAccount;
  }

  async creditAccount(command: CreditAccountCommand): Promise<PrivatePlanAccount> {
    const userId = new UserId(command.userId);
    const accountId = new AccountId(command.accountId);
    const amount = new Money(command.amount);

    const account = await this.accountRepository.getByUserId(userId.value, accountId.value);
    if (!account) {
      throw new Error(`Account ${accountId.value} not found for user ${userId.value}`);
    }

    const updatedAccount = await AccountDomainService.creditAccount(account, amount.amount, command.reason);
    
    await this.accountRepository.updateByUserId(userId.value, accountId.value, updatedAccount);
    
    return updatedAccount;
  }

  async checkAccountBalance(userId: string, accountId: string): Promise<number> {
    const account = await this.accountRepository.getByUserId(userId, accountId);
    if (!account) {
      throw new Error(`Account ${accountId} not found for user ${userId}`);
    }
    
    return AccountDomainService.calculateAvailableBalance(account);
  }
}
