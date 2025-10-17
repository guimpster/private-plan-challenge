import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PrivatePlanAccountService } from '../../business/service/private-plan-account.service';
import { AccountDto } from './dtos/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly privatePlanAccountService: PrivatePlanAccountService) {}

  @Get('/:id')
  async findOne(@Param('id') accountId: string, @Query() { userId }: { userId: string }): Promise<AccountDto | undefined> {
    const account = await this.privatePlanAccountService.findByUserId(userId, accountId);

    // throw account not found error
    if (!account) throw new NotFoundException(`Account ${accountId} for user ${userId} not found`);

    return new AccountDto({
        id: account.id,
        cashAvailableForWithdrawal: account.cashAvailableForWithdrawal,
        cashBalance: account.cashBalance,
        created_at: account.created_at,
        updated_at: account.updated_at
    });
  }
}
