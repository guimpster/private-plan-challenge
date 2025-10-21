import { Module } from '@nestjs/common';
import { BradescoController } from './bradesco.controller';
import { WithdrawalCqrsModule } from 'src/cqrs/withdrawal/withdrawal.module';

@Module({
  imports: [WithdrawalCqrsModule],
  controllers: [BradescoController],
})
export class BradescoWebHookModule {}
