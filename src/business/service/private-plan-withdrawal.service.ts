import { Injectable } from '@nestjs/common';
import { PrivatePlanWithdrawal } from '../entities/private-plan-withdrawal';
import { PrivatePlanWithdrawalRepository } from '../repository/private-plan-withdrawal.repository';
import { PrivatePlanAccountRepository } from '../repository/private-plan-account.repository';
import {
  PrivatePlanWithdrawalRepository,
  PrivatePlanAccountRepository,
  BankGateway,
  Mailer,
} from '../ports';

@Injectable()
export class PrivatePlanWithdrawalService {
  constructor(
    private readonly withdrawals: PrivatePlanWithdrawalRepository,
    private readonly accounts: PrivatePlanAccountRepository,
    private readonly bank: BankGateway,
    private readonly mailer: Mailer,
  ) {}

  // ---------- helpers ----------

  private async getWithdrawalOrThrow(id: string): Promise<PrivatePlanWithdrawal> {
    const w = await this.withdrawals.findById(id);
    if (!w) throw new NotFoundException(`Withdrawal ${id} not found`);
    return w;
  }

  private assertStep(
    w: PrivatePlanWithdrawal,
    allowed: PrivatePlanWithdrawalStep | PrivatePlanWithdrawalStep[],
  ) {
    const set = Array.isArray(allowed) ? allowed : [allowed];
    if (!set.includes(w.step)) {
      throw new BadRequestException(`Withdrawal ${w.id} is at step ${w.step}; expected ${set.join(' | ')}`);
    }
  }

  // ---------- step methods (no implementation, DB checks included) ----------

  /** Step 1: Check balance (event: WithdrawalRequested → command: CheckBalance) */
  async checkBalance(withdrawalId: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, [PrivatePlanWithdrawalStep.CREATED]);
    // TODO: load source account; if insufficient → set INSUFFICIENT_FUNDS & persist
    // TODO: else advance to DEBITING & persist
  }

  /** Step 2: Debit account (command: DebitAccount or invoked after check-pass) */
  async debitAccount(withdrawalId: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, PrivatePlanWithdrawalStep.DEBITING);
    // TODO: load account; subtract w.amount; persist account
    // TODO: advance to SENDING_TO_BANK & persist withdrawal
    // TODO: publish AccountDebitedEvent
  }

  /** Step 3: Send to bank (command: SendBankTransfer) */
  async sendBankTransfer(withdrawalId: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, PrivatePlanWithdrawalStep.SENDING_TO_BANK);
    // TODO: call bank gateway with idempotency; on success publish TransferSentEvent
    // TODO: on failure publish TransferFailedEvent
  }

  /** Compensation step on failure (command: RollbackDebit) */
  async rollbackDebit(withdrawalId: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, PrivatePlanWithdrawalStep.ROLLING_BACK);
    // TODO: load account; add w.amount back; persist account
    // TODO: mark FAILED & persist withdrawal
    // (optionally) publish WithdrawalRolledBackEvent
  }

  /** Finalize success (command: FinalizeWithdrawal success=true) */
  async finalizeWithdrawalSuccess(withdrawalId: string, bankTxnId: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, PrivatePlanWithdrawalStep.SENDING_TO_BANK);
    // TODO: set destinationTransactionId, flags (processed/sent/userCredited)
    // TODO: step = COMPLETED; persist
  }

  /** Finalize failure (command: FinalizeWithdrawal success=false) */
  async finalizeWithdrawalFailure(withdrawalId: string, reason?: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, [PrivatePlanWithdrawalStep.ROLLING_BACK, PrivatePlanWithdrawalStep.FAILED]);
    // TODO: ensure processed=true, sentToDestination=false, userCredited=false, comment=reason
    // TODO: step = FAILED; persist
  }

  /** Notify success (command: NotifyUser success=true) */
  async notifyUserOfSuccess(withdrawalId: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, PrivatePlanWithdrawalStep.COMPLETED);
    // TODO: resolve user email; this.mailer.send(...)
  }

  /** Notify failure (command: NotifyUser success=false) */
  async notifyUserOfFailure(withdrawalId: string, reason?: string): Promise<void> {
    const w = await this.getWithdrawalOrThrow(withdrawalId);
    this.assertStep(w, [PrivatePlanWithdrawalStep.FAILED, PrivatePlanWithdrawalStep.ROLLING_BACK]);
    // TODO: resolve user email; this.mailer.send(...)
  }
}
