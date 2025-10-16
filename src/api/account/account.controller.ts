import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AccountService } from '../../business/message/service/message.service';
import { CreateMessageDto } from '../../business/message/dto/create-message.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createMessageDto: CreateMessageDto) {
    return this.accountService.create(createMessageDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }
}
