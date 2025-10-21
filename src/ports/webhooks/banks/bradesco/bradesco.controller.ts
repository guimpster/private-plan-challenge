import { Body, Controller, Post } from '@nestjs/common';
import { BradescoWebHookDto } from './dtos/bradesco.dto';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { ReceiveBankTransferCommand } from 'src/cqrs/withdrawal/commands/commands';
import { CouldNotTransferError } from 'src/business/errors/errors';
import { BankResponseReceivedEvent, WithdrawalRollingBackEvent } from 'src/cqrs/withdrawal/events';

@Controller('bradesco')
export class BradescoController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  @Post('')
  async findOne(@Body() dto: BradescoWebHookDto): Promise<void> {
    if (dto.success) {
      // Emit bank response event for successful transfer
      this.eventBus.publish(
        new BankResponseReceivedEvent(
          dto.withdrawalId,
          dto.userId,
          dto.accountId,
          `bradesco_${Date.now()}`, // Generate bank transaction ID
          'SUCCESS',
          '200',
          'Transfer completed successfully',
          new Date()
        )
      );
    } else {
      // Emit rolling back event for failed transfer
      this.eventBus.publish(
        new WithdrawalRollingBackEvent(
          dto.withdrawalId,
          dto.userId,
          dto.accountId,
          dto.error,
          new Date()
        )
      );
    }

    // Also execute the existing command for backward compatibility
    await this.commandBus.execute(
      new ReceiveBankTransferCommand(
        dto.userId,
        dto.accountId,
        dto.withdrawalId,
        dto.success,
        dto.error === 'Invalid transfer' ? new CouldNotTransferError(dto.error) : undefined,
      ),
    );

    return;
  }
}
