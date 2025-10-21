import { Injectable, Logger } from '@nestjs/common';
import { InMemoryPrivatePlanDepositRepository } from '../repository/in-memory/in-memory-private-plan-deposit.repository';
import { PrivatePlanDeposit } from '../business/domain/entities/private-plan-deposit';
import { Source } from '../business/domain/entities/source';

@Injectable()
export class TestDataSetup {
  private readonly logger = new Logger(TestDataSetup.name);

  constructor(
    private readonly depositRepository: InMemoryPrivatePlanDepositRepository,
  ) {}

  /**
   * Setup test deposits for testing the daily job
   */
  setupTestDeposits(): void {
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
        destinationPrivatePlanAccountId: 'e05a5f81-8e1c-4bb1-aa01-bb9dfc8d8472', // Existing account
        destinationTransactionId: 'dest_txn_123',
        processed: true,
        sentToDestination: true,
        userCredited: false,
        amount: 1000.00,
        cancelRequested: false,
        canceled: false,
        comment: 'Test deposit for today',
        source: 'system' as Source,
        release_at: today, // Due today
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
        amount: 500.00,
        cancelRequested: false,
        canceled: false,
        comment: 'Test deposit for tomorrow',
        source: 'ops' as Source,
        release_at: tomorrow, // Due tomorrow
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
        userCredited: true, // Already credited
        amount: 200.00,
        cancelRequested: false,
        canceled: false,
        comment: 'Already credited deposit',
        source: 'system' as Source,
        release_at: yesterday, // Due yesterday but already credited
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

  /**
   * Get all test deposits
   */
  getAllTestDeposits(): PrivatePlanDeposit[] {
    return this.depositRepository.getAllDeposits();
  }
}
