import { Injectable } from '@nestjs/common';

import { Account } from '../../entities/account.entity';
import { AccountRepository } from '../../repository/account.repository';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  // TODO: check if user is authenticated and has permissions
  async findByUserId(userId: string): Promise<Account> {
    return this.accountRepository.getByUserId(userId);
  }
}
