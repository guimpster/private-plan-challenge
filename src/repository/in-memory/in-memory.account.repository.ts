import * as fs from 'fs';
import * as path from 'path';

import { Injectable, Logger } from '@nestjs/common';
import { Account } from 'src/business/entities/account.entity';
import { AccountRepository } from 'src/business/repository/account.repository';


@Injectable()
export class InMemoryAccountRepository extends AccountRepository {
    private accounts: Account[] = [];

    private readonly fakeAccountsFile = path.join(__dirname, './data/accounts.json');

    private readonly logger = new Logger(InMemoryAccountRepository.name);

    constructor() {
        super();
        this.loadFakeAccountsFromFile();
    }

    getByUserId(userId: string): Promise<Account | undefined> {
        return Promise.resolve(this.accounts.find((account) => account.userId === userId));
    }

    updateById(accountId: string, account: Account): Promise<Account | undefined> {
        return Promise.resolve((() => {
            const accountFound = this.accounts.find((account) => account.id === accountId)
            if (!accountFound) return;
    
            Object.assign(accountFound, account, { updated_at: new Date() });
            return accountFound;
        })());
    }

    private loadFakeAccountsFromFile() {
        const raw = fs.readFileSync(this.fakeAccountsFile, 'utf-8');
        const parsed = JSON.parse(raw);

        this.accounts = parsed.map((acc: any) => new Account({
            ...acc,
            created_at: new Date(acc.created_at),
            updated_at: new Date(acc.updated_at),
            inactivated_at: acc.inactivated_at ? new Date(acc.inactivated_at) : null,
        }));

        this.logger.log(`Loaded ${this.accounts.length} accounts from file.`);
    }
}
