import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { ProcessDepositsForReleaseCommand, SetupTestDataCommand, GetTestDepositsCommand } from './commands';
import { PrivatePlanDepositService } from '../../../business/domain/services/private-plan-deposit.service';
import { InMemoryPrivatePlanDepositRepository } from '../../../repository/in-memory/in-memory-private-plan-deposit.repository';
import { PrivatePlanDeposit } from '../../../business/domain/entities/private-plan-deposit';
import { Source } from '../../../business/domain/entities/source';

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

@CommandHandler(SetupTestDataCommand)
export class SetupTestDataHandler implements ICommandHandler<SetupTestDataCommand> {
  private readonly logger = new Logger(SetupTestDataHandler.name);

  constructor(
    private readonly depositRepository: InMemoryPrivatePlanDepositRepository,
  ) {}

  async execute(command: SetupTestDataCommand): Promise<void> {
    this.logger.log('🔧 Setting up test deposits...');

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const testDeposits: PrivatePlanDeposit[] = [
      {
        id: 'deposit_1',
        userId: '19ca04c6-9c96-40f4-b7db-a55394b5a58d',
        accountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472',
        sourceBankAccountId: 'bank_123',
        sourceTransactionId: 'txn_123',
        destinationPrivatePlanAccountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472',
        destinationTransactionId: 'dest_txn_123',
        processed: true,
        sentToDestination: true,
        userCredited: false,
        amount: 100000, // 1000.00 in cents
        cancelRequested: false,
        canceled: false,
        comment: 'Test deposit for today',
        source: 'system' as Source,
        release_at: today,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'deposit_2',
        userId: '19ca04c6-9c96-40f4-b7db-a55394b5a58d',
        accountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472',
        sourceBankAccountId: 'bank_456',
        sourceTransactionId: 'txn_456',
        destinationPrivatePlanAccountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472',
        destinationTransactionId: 'dest_txn_456',
        processed: true,
        sentToDestination: true,
        userCredited: false,
        amount: 50000, // 500.00 in cents
        cancelRequested: false,
        canceled: false,
        comment: 'Test deposit for tomorrow',
        source: 'ops' as Source,
        release_at: tomorrow,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'deposit_3',
        userId: '19ca04c6-9c96-40f4-b7db-a55394b5a58d',
        accountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472',
        sourceBankAccountId: 'bank_789',
        sourceTransactionId: 'txn_789',
        destinationPrivatePlanAccountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472',
        destinationTransactionId: 'dest_txn_789',
        processed: true,
        sentToDestination: true,
        userCredited: true,
        amount: 20000, // 200.00 in cents
        cancelRequested: false,
        canceled: false,
        comment: 'Already credited deposit',
        source: 'system' as Source,
        release_at: yesterday,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    testDeposits.forEach(deposit => {
      this.depositRepository.addDeposit(deposit);
    });

    this.logger.log(`✅ Added ${testDeposits.length} test deposits`);
    this.logger.log(`📊 Deposits due today: ${testDeposits.filter(d => d.release_at.toDateString() === today.toDateString() && !d.userCredited).length}`);
    this.logger.log(`📊 Deposits due tomorrow: ${testDeposits.filter(d => d.release_at.toDateString() === tomorrow.toDateString() && !d.userCredited).length}`);
  }
}

@CommandHandler(GetTestDepositsCommand)
export class GetTestDepositsHandler implements ICommandHandler<GetTestDepositsCommand> {
  private readonly logger = new Logger(GetTestDepositsHandler.name);

  constructor(
    private readonly depositRepository: InMemoryPrivatePlanDepositRepository,
  ) {}

  async execute(command: GetTestDepositsCommand): Promise<any[]> {
    this.logger.log('📊 Retrieving test deposits');
    
    const deposits = this.depositRepository.getAllDeposits();
    return deposits.map(deposit => ({
      id: deposit.id,
      userId: deposit.userId,
      accountId: deposit.accountId,
      amount: deposit.amount,
      release_at: deposit.release_at,
      userCredited: deposit.userCredited,
      destinationAccountId: deposit.destinationPrivatePlanAccountId,
      comment: deposit.comment
    }));
  }
}
