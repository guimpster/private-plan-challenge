import { Body, Controller, Post } from '@nestjs/common';
import { BradescoWebHookDto } from './dtos/bradesco.dto';
import { CommandBus } from '@nestjs/cqrs';
import { ReceiveBankTransferCommand } from 'src/cqrs/withdrawal/commands';
import { CouldNotTransferError } from 'src/business/errors/errors';

@Controller('bradesco')
export class AccountController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('')
  async findOne(@Body() dto: BradescoWebHookDto): Promise<void> {
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
