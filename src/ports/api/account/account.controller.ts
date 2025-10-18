import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAccountByIdQuery } from '../../../cqrs/account/queries';
import { AccountDto } from './dtos/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  async findOne(@Param('id') accountId: string, @Query() { userId }: { userId: string }): Promise<AccountDto | undefined> {
    const account = await this.queryBus.execute(new GetAccountByIdQuery(userId, accountId));

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
