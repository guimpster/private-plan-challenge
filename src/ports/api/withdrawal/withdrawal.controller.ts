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
import { EventBus } from '@nestjs/cqrs';
import { PrivatePlanWithdrawalStep } from 'src/business/domain/entities/private-plan-withdrawal';
import { WithdrawalCreatedEvent } from 'src/cqrs/withdrawal/events';

@Controller('api/v1/users/:userId/accounts/:accountId/withdrawals')
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class WithdrawalController {
  constructor(
    private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService, 
    private readonly eventBus: EventBus
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

      const withdrawal = await this.privatePlanWithdrawalService.createWithdrawal(
        dto.userId, 
        dto.accountId, 
        dto.bankAccountId, 
        'whatsapp', 
        dto.amount
      );

      // Emit event to start the saga
      this.eventBus.publish(
        new WithdrawalCreatedEvent(
          withdrawal.id,
          dto.userId,
          dto.accountId,
          dto.bankAccountId,
          dto.amount,
          withdrawal.created_at
        )
      );

      return new WithdrawalResponseDto({
        id: withdrawal.id,
        userId: dto.userId,
        accountId: dto.accountId,
        bankAccountId: dto.bankAccountId,
        amount: dto.amount,
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
    const withdrawal = await this.privatePlanWithdrawalService.getWithdrawalById(
      userId, 
      accountId, 
      withdrawalId
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
