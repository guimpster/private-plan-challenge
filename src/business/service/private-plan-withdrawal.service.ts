import { Injectable } from '@nestjs/common';
import { PrivatePlanWithdrawal } from '../entities/private-plan-withdrawal';
import { PrivatePlanWithdrawalRepository } from '../repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../repository/private-plan-account.repository';

@Injectable()
export class PrivatePlanWithdrawalService {
  constructor(private readonly privatePlanWithdrawalRepository: PrivatePlanWithdrawalRepository, private readonly accountRepository: PrivatePlanAccountRepository) {}

  // TODO: check if user is authenticated and has permissions
  async processWithdrawal(userId: string, accountId: string, amount: number): Promise<void> {
    // check if account has enough cash balance

    // decreases account value by freezing it

    // send withdrawal to the user's bank

    // if withdrawal didn't succeeded, increase account value

    // update withdrawal final status

    // send user an email if succeeded or not
  }
}
