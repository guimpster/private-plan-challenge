import { Injectable } from '@nestjs/common';
import { Withdrawal } from '../../entities/withdrawal.entity';
import { WithdrawalRepository } from '../../repository/withdrawal.repository';
import { AccountRepository } from '../../repository/account.repository';

@Injectable()
export class WithdrawalService {
  constructor(private readonly withdrawalRepository: WithdrawalRepository, private readonly accountRepository: AccountRepository) {}

  // TODO: check if user is authenticated and has permissions
  async processWithdrawal(userId: string, withdrawal: Withdrawal) {
    // check if account has enough cash balance

    // decreases account value by freezing it

    // send withdrawal to the user's bank

    // if withdrawal didn't succeeded, increase account value

    // update withdrawal final status

    // send user an email if succeeded or not
  }
}
