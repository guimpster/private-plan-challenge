import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ProcessDepositsForReleaseCommand } from './commands';
import { PrivatePlanDepositService } from '../../../business/domain/services/private-plan-deposit.service';

@CommandHandler(ProcessDepositsForReleaseCommand)
export class ProcessDepositsForReleaseHandler implements ICommandHandler<ProcessDepositsForReleaseCommand> {
  private readonly logger = new Logger(ProcessDepositsForReleaseHandler.name);

  constructor(
    private readonly privatePlanDepositService: PrivatePlanDepositService,
  ) {}

  async execute(command: ProcessDepositsForReleaseCommand): Promise<void> {
    this.logger.log(`🔄 Processing deposits for release date: ${command.releaseDate.toISOString().split('T')[0]}`);
    
    await this.privatePlanDepositService.processDepositsForRelease(command.releaseDate);
    
    this.logger.log('✅ Deposit processing completed successfully');
  }
}
