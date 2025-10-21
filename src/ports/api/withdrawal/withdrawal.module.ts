import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { WithdrawalController } from './withdrawal.controller';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { WithdrawalsModule } from 'src/cqrs/withdrawal/withdrawal.module';

@Module({
  imports: [CqrsModule, InfrastructureModule, WithdrawalsModule],
  controllers: [WithdrawalController],
  providers: [],
})
export class WithdrawalModule {}
