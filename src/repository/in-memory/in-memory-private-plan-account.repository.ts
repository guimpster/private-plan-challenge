import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrivatePlanAccount } from 'src/business/entities/private-plan-account';
import { PrivatePlanAccountRepository } from 'src/business/repository/private-plan-account.repository';
import { IN_MEMORY_DB } from './db/in-memory-db';
import type { DBData } from './db/in-memory-db.entity';

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
            const accountFound = this.getByUserId(userId, accountId);
            if (!accountFound) return;
    
            Object.assign(accountFound, account, { updated_at: new Date() });
            return accountFound;
        })());
    }
}
