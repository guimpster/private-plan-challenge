import { Controller, Get } from '@nestjs/common';
import { AccountService } from '../../business/service/account/account.service';
import { AccountDto } from './dtos/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async findOne(): Promise<AccountDto> {
    const account = await this.accountService.findByUserId();

    return new AccountDto({
        id: account.id,
        cashAvailableForWithdrawal: account.cashAvailableForWithdrawal,
        cashBalance: account.cashBalance,
        created_at: account.created_at,
        updated_at: account.updated_at
    });
  }
}
