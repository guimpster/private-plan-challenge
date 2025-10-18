import { PrivatePlanAccount } from './private-plan-account';
import { AccountDebitedEvent, AccountCreditedEvent, InsufficientFundsEvent } from './account-events';
import { DomainEventDispatcher } from './domain-events';

export class AccountDomainService {
  static async debitAccount(
    account: PrivatePlanAccount,
    amount: number,
    withdrawalId: string
  ): Promise<PrivatePlanAccount> {
    if (account.cashAvailableForWithdrawal < amount) {
      await DomainEventDispatcher.dispatch(
        new InsufficientFundsEvent(
          account.userId,
          account.id,
          amount,
          account.cashAvailableForWithdrawal
        )
      );
      throw new Error(`Insufficient funds. Available: ${account.cashAvailableForWithdrawal}, Requested: ${amount}`);
    }

    const updatedAccount = new PrivatePlanAccount({
      ...account,
      cashAvailableForWithdrawal: account.cashAvailableForWithdrawal - amount,
      cashBalance: account.cashBalance - amount,
      updated_at: new Date()
    });

    await DomainEventDispatcher.dispatch(
      new AccountDebitedEvent(account.userId, account.id, amount, withdrawalId)
    );

    return updatedAccount;
  }

  static async creditAccount(
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

    await DomainEventDispatcher.dispatch(
      new AccountCreditedEvent(account.userId, account.id, amount, reason)
    );

    return updatedAccount;
  }

  static canWithdraw(account: PrivatePlanAccount, amount: number): boolean {
    return account.cashAvailableForWithdrawal >= amount;
  }

  static calculateAvailableBalance(account: PrivatePlanAccount): number {
    return account.cashAvailableForWithdrawal;
  }
}
