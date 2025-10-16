import { Account } from '../entities/account.entity';

export abstract class AccountRepository {
  abstract getByUserId(userId: string): Promise<Account | undefined>;
  abstract updateById(accountId: string, account: Account): Promise<Account | undefined>;
}
