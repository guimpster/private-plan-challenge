import { Module } from '@nestjs/common';
import { BradescoController } from './bradesco.controller';
import { WithdrawalsModule } from 'src/cqrs/withdrawal/withdrawal.module';

@Module({
  imports: [WithdrawalsModule],
  controllers: [BradescoController],
})
export class BradescoWebHookModule {}
