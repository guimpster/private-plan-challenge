import { 
  Controller, 
  Get, 
  NotFoundException, 
  Param, 
  HttpStatus,
  UseGuards,
  Headers
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiHeader,
  ApiBearerAuth
} from '@nestjs/swagger';
import { QueryBus } from '@nestjs/cqrs';
import { GetAccountByIdQuery } from '../../../cqrs/account/queries';
import { AccountDto } from './dtos/account.dto';
import { ErrorResponseDto } from '../common/error-response.dto';

@ApiTags('Accounts')
@Controller('api/v1/users/:userId/accounts')
export class AccountController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':accountId')
  @ApiOperation({ 
    summary: 'Get account by ID',
    description: 'Retrieves account details for a specific user and account ID'
  })
  @ApiParam({ 
    name: 'userId', 
    description: 'User identifier',
    example: 'user_123456789'
  })
  @ApiParam({ 
    name: 'accountId', 
    description: 'Account identifier',
    example: 'acc_123456789'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Account found successfully',
    type: AccountDto
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Account not found',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized access',
    type: ErrorResponseDto
  })
  @ApiResponse({ 
    status: HttpStatus.FORBIDDEN, 
    description: 'Access forbidden',
    type: ErrorResponseDto
  })
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
