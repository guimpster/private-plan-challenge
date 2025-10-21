import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrivatePlanAccount } from 'src/business/domain/entities/private-plan-account';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { IN_MEMORY_DB } from '../../infrastructure/db/in-memory/in-memory-db';
import type { DBData } from '../../infrastructure/db/in-memory/in-memory-db.entity';
import { Result } from 'src/business/common/index';
import { AccountNotFoundError, NotEnoughFunds, UserNotFoundError } from 'src/business/errors/errors';

@Injectable()
export class InMemoryPrivatePlanAccountRepository extends PrivatePlanAccountRepository {
    private readonly logger = new Logger(InMemoryPrivatePlanAccountRepository.name);

    constructor(@Inject(IN_MEMORY_DB) private readonly db: DBData) {
        super();
    }

    getByUserId(userId: string, id: string): Promise<PrivatePlanAccount | undefined> {
        const user = this.db.users.find((user) => user.id === userId);
        if (!user) return Promise.resolve(undefined);

        return Promise.resolve(user.accounts.find((account) => account.id === id));
    }

    updateByUserId(userId: string, accountId: string, account: PrivatePlanAccount): Promise<PrivatePlanAccount | undefined> {
        return Promise.resolve((() => {
            const user = this.db.users.find((user) => user.id === userId);
            if (!user) return;

            const accountFound = user.accounts.find((account) => account.id === accountId)
            if (!accountFound) return;
    
            Object.assign(accountFound, account, { updated_at: new Date() });
            return accountFound;
        })());
    }

    checkAndDebitAccount(userId: string, id: string, amount: number): Promise<Result<PrivatePlanAccount, NotEnoughFunds>> {
        return Promise.resolve((() => {
            const user = this.db.users.find((user) => user.id === userId);
            if (!user) {
                return {
                    ok: false,
                    error: new UserNotFoundError(`User ${userId} not found`)
                };
            }

            const accountFound = user.accounts.find((account) => account.id === id)
            if (!accountFound) {
                return {
                    ok: false,
                    error: new AccountNotFoundError(`Account ${id} for user ${userId} not found`)
                };
            }

            if (accountFound.cashAvailableForWithdrawal < amount) {
                return {
                    ok: false,
                    error: new NotEnoughFunds(`Not enough funds in account ${id} for user ${userId}. Amount: ${amount} CashAvailable: ${accountFound.cashAvailableForWithdrawal}`)
                };
            }
    
            Object.assign(accountFound, {
                cashAvailableForWithdrawal: accountFound.cashAvailableForWithdrawal - amount,
                cashBalance: accountFound.cashBalance - amount,
                updated_at: new Date()
            });

            return {
                ok: true,
                value: accountFound
            }
        })());
    }

    creditFailedWithdrawal(userId: string, id: string, amount: number): Promise<PrivatePlanAccount | undefined> {
        const user = this.db.users.find((user) => user.id === userId);
        if (!user) return Promise.resolve(undefined);

        const account = user.accounts.find((account) => account.id === id);
        if (!account) return Promise.resolve(undefined);

        account.cashAvailableForWithdrawal += amount;
        account.cashBalance += amount;
        account.updated_at = new Date();

        this.logger.log(`Credited failed withdrawal of ${amount} to account ${id} for user ${userId}`);

        return Promise.resolve(account);
    }
}
