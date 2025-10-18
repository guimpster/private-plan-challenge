import { 
  Body, 
  Controller, 
  Post, 
  Get,
  Param,
  HttpStatus,
  HttpCode,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { PrivatePlanWithdrawalService } from 'src/business/domain/services/private-plan-withdrawal.service';
import { WithdrawalResponseDto } from './dtos/process-withdrawal.dto';
import { CommandBus } from '@nestjs/cqrs';
import { DebitAccountCommand } from 'src/cqrs/withdrawal/commands';
import { PrivatePlanWithdrawalStep } from 'src/business/domain/entities/private-plan-withdrawal';

@Controller('api/v1/users/:userId/accounts/:accountId/withdrawals')
export class WithdrawalController {
  constructor(
    private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService, 
    private readonly commandBus: CommandBus
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createWithdrawal(
    @Param('userId') userId: string,
    @Param('accountId') accountId: string,
    @Body() body: { bankAccountId: string; amount: number }
  ): Promise<WithdrawalResponseDto> {
    try {
      console.log('Creating withdrawal with:', { userId, accountId, bankAccountId: body.bankAccountId, amount: body.amount });
      const withdrawal = await this.privatePlanWithdrawalService.createWithdrawal(
        userId, 
        accountId, 
        body.bankAccountId, 
        'whatsapp', 
        body.amount
      );
      console.log('Withdrawal created:', withdrawal);

      // Start the withdrawal process asynchronously
      // TODO: Uncomment this line once the withdrawal creation is working
      // await this.commandBus.execute(
      //   new DebitAccountCommand(
      //     userId,
      //     accountId,
      //     withdrawal.id
      //   ),
      // );

      return new WithdrawalResponseDto({
        id: withdrawal.id,
        userId: userId,
        accountId: accountId,
        bankAccountId: body.bankAccountId,
        amount: body.amount,
        status: PrivatePlanWithdrawalStep.CREATED,
        created_at: withdrawal.created_at || new Date()
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
      created_at: withdrawal.created_at || new Date()
    });
  }
}
