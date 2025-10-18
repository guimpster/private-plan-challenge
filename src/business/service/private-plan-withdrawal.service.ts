import { BadRequestException, Injectable } from '@nestjs/common';
import { BankTransferStatus, NotificationDeliveryState, PrivatePlanWithdrawal, PrivatePlanWithdrawalStep } from '../domain/private-plan-withdrawal';
import { PrivatePlanWithdrawalRepository } from '../repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../repository/private-plan-account.repository';
import { BankTransferError, BusinessError, CouldNotTransferError, NotEnoughFunds } from '../errors/errors';
import { randomUUID } from 'crypto';
import { Source } from '../domain/source';
import { BankService } from './bank.service';

@Injectable()
export class PrivatePlanWithdrawalService {
  constructor(
    private readonly privatePlanWithdrawalRepository: PrivatePlanWithdrawalRepository,
    private readonly privatePlanAccountRepository: PrivatePlanAccountRepository,
    private readonly bankService: BankService,
  ) {}

  private assertStep(
    w: PrivatePlanWithdrawal,
    allowed: PrivatePlanWithdrawalStep | PrivatePlanWithdrawalStep[],
  ) {
    const set = Array.isArray(allowed) ? allowed : [allowed];
    if (!set.includes(w.step)) {
      throw new BadRequestException(`Withdrawal ${w.id} is at step ${w.step}; expected ${set.join(' | ')}`);
    }
  }

  async createWithdrawal(userId: string, accountId: string, bankAccountId: string, source: Source, amount: number): Promise<PrivatePlanWithdrawal> {
    const withdrawal = new PrivatePlanWithdrawal({
      sourcePrivatePlanAccountId: accountId,
      sourceTransactionId: randomUUID(),
      destinationBankAccountId: bankAccountId,
      bankStatus: BankTransferStatus.PENDING,
      bankAttemptCount: 0,
      notifySuccessState: NotificationDeliveryState.PENDING,
      notifyFailureState: NotificationDeliveryState.PENDING,
      notifyAttemptCount: 0,
      processed: false,
      sentToDestination: false,
      userCredited: false,
      amount,
      cancelRequested: false,
      canceled: false,
      comment: '',
      source,
      step: PrivatePlanWithdrawalStep.CREATED,
      stepRetrialCount: 0,
      stepHistory: [{ step: PrivatePlanWithdrawalStep.CREATED, stepRetrialCount: 0, at: new Date() }]
    });

    const createdWithdrawal = await this.privatePlanWithdrawalRepository.create(userId, accountId, withdrawal);
    console.log('Created withdrawal:', createdWithdrawal);
    return createdWithdrawal;
  }

  async debitAccount(userId: string, accountId: string, withdrawalId: string): Promise<void> {
    const withdrawal = await this.privatePlanWithdrawalRepository.getById(userId, accountId, withdrawalId);
    if (!withdrawal) {
      throw new BadRequestException(`Withdrawal ${withdrawalId} not found for account ${accountId} and user ${userId}`);
    }
    
    this.assertStep(withdrawal, PrivatePlanWithdrawalStep.CREATED);

    // TODO: calculate taxes irpf, fees, and actual value to debit

    await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step: PrivatePlanWithdrawalStep.DEBITING });

    // TODO: debit the right value from the calculated above
    const result = await this.privatePlanAccountRepository.checkAndDebitAccount(userId, accountId, withdrawal.amount);

    if (!result.ok) {
        const step = result.error instanceof NotEnoughFunds ? PrivatePlanWithdrawalStep.INSUFFICIENT_FUNDS : PrivatePlanWithdrawalStep.FAILED;

        await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step });

        return;
    }

    await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step: PrivatePlanWithdrawalStep.SENDING_TO_BANK });
  }

  async sendBankTransfer(userId: string, accountId: string, withdrawalId: string): Promise<void> {
    const withdrawal = await this.privatePlanWithdrawalRepository.getById(userId, accountId, withdrawalId);
    if (!withdrawal) {
      throw new BadRequestException(`Withdrawal ${withdrawalId} not found for account ${accountId} and user ${userId}`);
    }

    this.assertStep(withdrawal, PrivatePlanWithdrawalStep.SENDING_TO_BANK);

    // TODO: change to calculated withdrawal amount (after fees, taxes, etc)
    const result = await this.bankService.sendTransfer(userId, withdrawal.destinationBankAccountId, withdrawal.amount);

    if (!result.ok && result.error instanceof BankTransferError) {
        await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step: PrivatePlanWithdrawalStep.ROLLING_BACK });

        return;
    }
  }

  async receiveBankTransferNotification(userId: string, accountId: string, withdrawalId: string, success: boolean, error?: CouldNotTransferError): Promise<void> {
    const withdrawal = await this.privatePlanWithdrawalRepository.getById(userId, accountId, withdrawalId);
    if (!withdrawal) {
      throw new BadRequestException(`Withdrawal ${withdrawalId} not found for account ${accountId} and user ${userId}`);
    }

    this.assertStep(withdrawal, PrivatePlanWithdrawalStep.SENDING_TO_BANK);

    const step = success ? PrivatePlanWithdrawalStep.COMPLETED : PrivatePlanWithdrawalStep.ROLLING_BACK;

    await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step, comment: error ? error.message : '' });
  }

  async rollbackDebit(userId: string, accountId: string, withdrawalId: string): Promise<void> {
    const withdrawal = await this.privatePlanWithdrawalRepository.getById(userId, accountId, withdrawalId);
    if (!withdrawal) {
      throw new BadRequestException(`Withdrawal ${withdrawalId} not found for account ${accountId} and user ${userId}`);
    }

    this.assertStep(withdrawal, PrivatePlanWithdrawalStep.ROLLING_BACK);

    await this.privatePlanAccountRepository.creditFailedWithdrawal(userId, accountId, withdrawal.amount);

    await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step: PrivatePlanWithdrawalStep.FAILED });
  }

  async finalizeWithdrawalSuccess(withdrawalId: string, bankTxnId: string): Promise<void> {
    // Find withdrawal by ID across all users and accounts
    // This is a simplified implementation - in a real scenario, you'd need to track withdrawalId to user/account mapping
    // For now, we'll implement a basic version that updates the withdrawal status
    
    // TODO: Implement proper withdrawal lookup by ID
    // This method should find the withdrawal and update it to completed status
    console.log(`Finalizing withdrawal ${withdrawalId} with bank transaction ID ${bankTxnId}`);
  }

  async finalizeWithdrawalFailure(withdrawalId: string, reason: string): Promise<void> {
    // Find withdrawal by ID across all users and accounts
    // This is a simplified implementation - in a real scenario, you'd need to track withdrawalId to user/account mapping
    // For now, we'll implement a basic version that updates the withdrawal status
    
    // TODO: Implement proper withdrawal lookup by ID
    // This method should find the withdrawal and update it to failed status
    console.log(`Finalizing withdrawal ${withdrawalId} as failed. Reason: ${reason}`);
  }

  async getWithdrawalById(userId: string, accountId: string, withdrawalId: string): Promise<PrivatePlanWithdrawal | undefined> {
    return this.privatePlanWithdrawalRepository.getById(userId, accountId, withdrawalId);
  }
}
