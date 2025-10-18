import { Body, Controller, Post } from '@nestjs/common';
import { PrivatePlanWithdrawalService } from 'src/business/service/private-plan-withdrawal.service';
import { ProcessWithdrawalDto } from './dtos/process-withdrawal.dto';
import { CommandBus } from '@nestjs/cqrs';
import { DebitAccountCommand } from 'src/cqrs/withdrawal/commands';
import { PrivatePlanWithdrawalStep } from 'src/business/domain/private-plan-withdrawal';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService, private readonly commandBus: CommandBus) {}

  @Post()
  async processWithdrawal(@Body() dto: ProcessWithdrawalDto): Promise<ProcessWithdrawalDto & { status: PrivatePlanWithdrawalStep }> {
    const withdrawal = await this.privatePlanWithdrawalService.createWithdrawal(dto.userId, dto.accountId, dto.bankAccountId, 'whatsapp', dto.amount);

    await this.commandBus.execute(
      new DebitAccountCommand(
        dto.userId,
        dto.accountId,
        withdrawal.id
      ),
    );

    return { ...dto, status: PrivatePlanWithdrawalStep.CREATED };
  }
}
