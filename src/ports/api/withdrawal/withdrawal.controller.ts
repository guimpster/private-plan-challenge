import { Body, Controller, Post } from '@nestjs/common';
import { PrivatePlanWithdrawalService } from 'src/business/service/private-plan-withdrawal.service';
import { ProcessWithdrawalDto } from './dtos/process-withdrawal.dto';

@Controller('withdrawal')
export class WithdrawalController {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  @Post()
  async processWithdrawal(@Body() dto: ProcessWithdrawalDto): Promise<void> {
    await this.privatePlanWithdrawalService.processWithdrawal(dto.userId, dto.accountId, dto.amount);
  }
}
