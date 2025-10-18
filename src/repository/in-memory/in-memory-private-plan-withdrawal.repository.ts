import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IN_MEMORY_DB } from '../../infrastructure/db/in-memory/in-memory-db';
import type { DBData } from '../../infrastructure/db/in-memory/in-memory-db.entity';
import { PrivatePlanWithdrawalRepository } from 'src/business/repository/private-plan-withdrawal.repository';
import { PrivatePlanWithdrawal } from 'src/business/domain/private-plan-withdrawal';

@Injectable()
export class InMemoryPrivatePlanWithdrawalRepository extends PrivatePlanWithdrawalRepository {
    private readonly logger = new Logger(InMemoryPrivatePlanWithdrawalRepository.name);

    constructor(@Inject(IN_MEMORY_DB) private readonly db: DBData) {
        super();
    }

    create(userId: string, accountId: string, privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal> {
        const user = this.db.users.find(u => u.id === userId);
        if (!user) throw new Error(`User ${userId} not found`);

        const account = user.accounts.find(a => a.id === accountId);
        if (!account) throw new Error(`Account ${accountId} for user ${userId} not found`);

        const newWithdrawal = { ...privatePlanWithdrawal, id: randomUUID(), created_at: new Date(), updated_at: new Date() };
        account.withdrawals.push(newWithdrawal);
        return Promise.resolve(newWithdrawal);
    }

    updateById(userId: string, accountId: string, id: string, privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal> {
        const user = this.db.users.find(u => u.id === userId);
        if (!user) throw new Error(`User ${userId} not found`);

        const account = user.accounts.find(a => a.id === accountId);
        if (!account) throw new Error(`Account ${accountId} for user ${userId} not found`);

        const withdrawalIndex = account.withdrawals.findIndex(w => w.id === id);

        account.withdrawals[withdrawalIndex] = { ...account.withdrawals[withdrawalIndex], ...privatePlanWithdrawal, updated_at: new Date() };
        return Promise.resolve(account.withdrawals[withdrawalIndex]);
    }

    getById(userId: string, accountId: string, id: string): Promise<PrivatePlanWithdrawal | undefined> {
        const user = this.db.users.find(u => u.id === userId);
        if (!user) throw new Error(`User ${userId} not found`);

        const account = user.accounts.find(a => a.id === accountId);
        if (!account) throw new Error(`Account ${accountId} for user ${userId} not found`);

        const withdrawalIndex = account.withdrawals.findIndex(w => w.id === id);
        return Promise.resolve(withdrawalIndex >= 0 ? account.withdrawals[withdrawalIndex] : undefined);
    }
}