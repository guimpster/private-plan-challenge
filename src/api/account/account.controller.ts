import { Controller, Get, Param } from '@nestjs/common';
import { AccountService } from '../../business/service/account/account.service';
import { AccountDto } from './dtos/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('/user/:id')
  async findOne(@Param('id') userId: string): Promise<AccountDto | undefined> {
    const account = await this.accountService.findByUserId(userId);

    if (!account) return;

    return new AccountDto({
        id: account.id,
        cashAvailableForWithdrawal: account.cashAvailableForWithdrawal,
        cashBalance: account.cashBalance,
        created_at: account.created_at,
        updated_at: account.updated_at
    });
  }
}
