import { BadRequestException, Injectable } from '@nestjs/common';
import { BankTransferStatus, NotificationDeliveryState, PrivatePlanWithdrawal, PrivatePlanWithdrawalStep } from '../entities/private-plan-withdrawal';
import { PrivatePlanWithdrawalRepository } from '../repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../repository/private-plan-account.repository';
import { BankTransferError, NotEnoughFunds } from '../errors/errors';
import { randomUUID } from 'crypto';
import { Source } from '../entities/source.entity';
import type { NotificationService } from './notification.service';
import type { BankService } from './bank.service';

@Injectable()
export class PrivatePlanWithdrawalService {
  constructor(
    private readonly privatePlanWithdrawalRepository: PrivatePlanWithdrawalRepository,
    private readonly privatePlanAccountRepository: PrivatePlanAccountRepository,
    private readonly bankService: BankService,
    private readonly notificationService: NotificationService,
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

    return this.privatePlanWithdrawalRepository.create(userId, accountId, withdrawal);
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

        await this.notificationService.notifyUserOfFailure(userId, accountId, withdrawal.id, result.error);

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

        await this.notificationService.notifyUserOfFailure(userId, accountId, withdrawal.id, result.error);

        return;
    }

    await this.privatePlanWithdrawalRepository.updateById(userId, accountId, withdrawal.id, { step: PrivatePlanWithdrawalStep.COMPLETED });
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
}
