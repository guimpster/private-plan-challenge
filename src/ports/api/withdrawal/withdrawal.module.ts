import { Module } from '@nestjs/common';
import { WithdrawalController } from './withdrawal.controller';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { WithdrawalsModule } from 'src/cqrs/withdrawal/withdrawal.module';

@Module({
  imports: [InfrastructureModule, WithdrawalsModule],
  controllers: [WithdrawalController],
})
export class WithdrawalModule {}
