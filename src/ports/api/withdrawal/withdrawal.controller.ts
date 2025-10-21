import { 
  Body, 
  Controller, 
  Post, 
  Get,
  Param,
  HttpStatus,
  HttpCode,
  ValidationPipe,
  UsePipes,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrivatePlanWithdrawalService } from 'src/business/domain/services/private-plan-withdrawal.service';
import { CreateWithdrawalDto, WithdrawalResponseDto } from './dtos/process-withdrawal.dto';
import { EventBus, QueryBus, CommandBus } from '@nestjs/cqrs';
import { PrivatePlanWithdrawalStep } from 'src/business/domain/entities/private-plan-withdrawal';
import { WithdrawalCreatedEvent } from 'src/cqrs/withdrawal/events';
import { GetWithdrawalByIdQuery } from 'src/cqrs/withdrawal/queries/queries';
import { CreateWithdrawalCommand } from 'src/cqrs/withdrawal/commands/commands';
import { GetAccountByIdQuery } from 'src/cqrs/account/queries/queries';

@Controller('api/v1/users/:userId/accounts/:accountId/withdrawals')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class WithdrawalController {
  constructor(
    private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService, 
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWithdrawal(
    @Param('userId') userId: string,
    @Param('accountId') accountId: string,
    @Body() dto: CreateWithdrawalDto
  ): Promise<WithdrawalResponseDto> {
    try {
      // Validate that the userId and accountId in the URL match the DTO
      if (dto.userId !== userId || dto.accountId !== accountId) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User ID and Account ID in URL must match the request body',
          error: 'Bad Request',
          timestamp: new Date().toISOString(),
          path: `/api/v1/users/${userId}/accounts/${accountId}/withdrawals`
        });
      }

      // If no amount is provided, use the entire cashAvailableForWithdrawal
      let withdrawalAmount: number;
      if (!dto.amount) {
        const account = await this.queryBus.execute(
          new GetAccountByIdQuery(userId, accountId)
        );
        
        if (!account) {
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            message: `Account ${accountId} not found for user ${userId}`,
            error: 'Not Found',
            timestamp: new Date().toISOString(),
            path: `/api/v1/users/${userId}/accounts/${accountId}/withdrawals`
          });
        }

        withdrawalAmount = account.cashAvailableForWithdrawal;
        
        if (withdrawalAmount <= 0) {
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'No funds available for withdrawal',
            error: 'Bad Request',
            timestamp: new Date().toISOString(),
            path: `/api/v1/users/${userId}/accounts/${accountId}/withdrawals`
          });
        }
      } else {
        withdrawalAmount = dto.amount;
      }

      const withdrawal = await this.commandBus.execute(
        new CreateWithdrawalCommand(
          dto.userId, 
          dto.accountId, 
          dto.bankAccountId, 
          'whatsapp', 
          withdrawalAmount
        )
      );

      // Emit event to start the saga
      this.eventBus.publish(
        new WithdrawalCreatedEvent(
          withdrawal.id,
          dto.userId,
          dto.accountId,
          dto.bankAccountId,
          withdrawalAmount,
          withdrawal.created_at
        )
      );

      return new WithdrawalResponseDto({
        id: withdrawal.id,
        userId: dto.userId,
        accountId: dto.accountId,
        bankAccountId: dto.bankAccountId,
        amount: withdrawalAmount,
        status: PrivatePlanWithdrawalStep.CREATED,
        created_at: withdrawal.created_at,
        stepHistory: withdrawal.stepHistory || [],
        notifications: withdrawal.notifications || []
      });
    } catch (error) {
      if (error.message?.includes('not found')) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'Not Found',
          timestamp: new Date().toISOString(),
          path: `/api/v1/users/${userId}/accounts/${accountId}/withdrawals`
        });
      }
      throw error;
    }
  }

  @Get(':withdrawalId')
  async getWithdrawal(
    @Param('userId') userId: string,
    @Param('accountId') accountId: string,
    @Param('withdrawalId') withdrawalId: string
  ): Promise<WithdrawalResponseDto> {
    const withdrawal = await this.queryBus.execute(
      new GetWithdrawalByIdQuery(userId, accountId, withdrawalId)
    );

    if (!withdrawal) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Withdrawal ${withdrawalId} not found for user ${userId} and account ${accountId}`,
        error: 'Not Found',
        timestamp: new Date().toISOString(),
        path: `/api/v1/users/${userId}/accounts/${accountId}/withdrawals/${withdrawalId}`
      });
    }

    return new WithdrawalResponseDto({
      id: withdrawal.id,
      userId: userId,
      accountId: accountId,
      bankAccountId: withdrawal.destinationBankAccountId,
      amount: withdrawal.amount,
      status: withdrawal.step,
      created_at: withdrawal.created_at,
      stepHistory: withdrawal.stepHistory || [],
      notifications: withdrawal.notifications || []
    });
  }
}
