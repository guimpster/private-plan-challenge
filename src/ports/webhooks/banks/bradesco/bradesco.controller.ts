import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { PrivatePlanAccountService } from '../../business/service/private-plan-account.service';
import { BradescoWebHookDto } from './dtos/bradesco.dto';
import { CommandBus } from '@nestjs/cqrs';

@Controller('bradesco')
export class AccountController {
  constructor(private readonly privatePlanAccountService: PrivatePlanAccountService, private readonly commandBus: CommandBus) {}

  @Post('')
  async findOne(@Body() dto: BradescoWebHookDto): Promise<void> {
    const account = await this.privatePlanAccountService.findByUserId(userId, accountId);

    // throw account not found error
    if (!account) throw new NotFoundException(`Account ${accountId} for user ${userId} not found`);

    await this.commandBus.execute(
      new DebitAccountCommand(
        dto.userId,
        dto.accountId,
        withdrawal.id
      ),
    );

    return;
  }
}
