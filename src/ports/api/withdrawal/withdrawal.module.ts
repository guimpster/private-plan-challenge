import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WithdrawalController } from './withdrawal.controller';
import { WithdrawalCqrsModule } from 'src/cqrs/withdrawal/withdrawal.module';

@Module({
  imports: [CqrsModule, WithdrawalCqrsModule],
  controllers: [WithdrawalController],
  providers: [],
})
export class WithdrawalModule {}
