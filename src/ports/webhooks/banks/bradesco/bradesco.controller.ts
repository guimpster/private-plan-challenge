import { Body, Controller, Post, Logger } from '@nestjs/common';
import { BradescoWebHookDto } from './dtos/bradesco.dto';
import { EventBus } from '@nestjs/cqrs';
import { BankResponseReceivedEvent, WithdrawalRollingBackEvent } from 'src/cqrs/withdrawal/events';

@Controller('bradesco')
export class BradescoController {
  private readonly logger = new Logger(BradescoController.name);

  constructor(
    private readonly eventBus: EventBus
  ) {}

  @Post('')
  async findOne(@Body() dto: BradescoWebHookDto): Promise<void> {
    if (dto.success) {
      this.eventBus.publish(
        new BankResponseReceivedEvent(
          dto.withdrawalId,
          dto.userId,
          dto.accountId,
          `bradesco_${Date.now()}`,
          'SUCCESS',
          '200',
          'Transfer completed successfully',
          new Date()
        )
      );
    } else {
      this.logger.log(`🔄 Bradesco Controller: Publishing WithdrawalRollingBackEvent for withdrawal: ${dto.withdrawalId}`);
      this.eventBus.publish(
        new WithdrawalRollingBackEvent(
          dto.withdrawalId,
          dto.userId,
          dto.accountId,
          dto.error,
          new Date()
        )
      );
      this.logger.log('✅ Bradesco Controller: WithdrawalRollingBackEvent published successfully');
    }
  }
}
