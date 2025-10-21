import { 
  Controller, 
  Get, 
  NotFoundException, 
  Param, 
  HttpStatus
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAccountByIdQuery } from '../../../cqrs/account/queries/queries';
import { AccountDto } from './dtos/account.dto';

@Controller('api/v1/users/:userId/accounts')
export class AccountController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':accountId')
  async getAccount(
    @Param('userId') userId: string,
    @Param('accountId') accountId: string
  ): Promise<AccountDto> {
    const account = await this.queryBus.execute(new GetAccountByIdQuery(userId, accountId));

    if (!account) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Account ${accountId} not found for user ${userId}`,
        error: 'Not Found',
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${userId}/accounts/${accountId}`
      });
    }

    return new AccountDto({
      id: account.id,
      cashAvailableForWithdrawal: account.cashAvailableForWithdrawal,
      cashBalance: account.cashBalance,
      created_at: account.created_at,
      updated_at: account.updated_at
    });
  }
}
