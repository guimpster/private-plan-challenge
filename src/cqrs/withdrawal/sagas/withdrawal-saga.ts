import { Injectable, Logger } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { WithdrawalCreatedEvent } from '../events/withdrawal-created.event';
import { DebitAccountCommand, SendToBankCommand, RollbackDebitCommand, CompleteWithdrawalCommand, RollbackWithdrawalCommand } from '../commands/commands';
import { WithdrawalDebitedEvent } from '../events/withdrawal-debited.event';
import { WithdrawalSentToBankEvent } from '../events/withdrawal-sent-to-bank.event';
import { BankResponseReceivedEvent } from '../events/bank-response-received.event';
import { WithdrawalRollingBackEvent } from '../events/withdrawal-rolling-back.event';
import { BankTransferCompletedEvent } from '../events/bank-transfer-completed.event';
import { WithdrawalInsufficientFundsEvent } from '../events/withdrawal-insufficient-funds.event';
import { WithdrawalFailedEvent } from '../events/withdrawal-failed.event';
import { PrivatePlanWithdrawalService } from '../../../business/domain/services/private-plan-withdrawal.service';
import { PrivatePlanWithdrawalStep } from '../../../business/domain/entities/private-plan-withdrawal';

@Injectable()
export class WithdrawalSaga {
  private readonly logger = new Logger(WithdrawalSaga.name);

  constructor(
    private readonly withdrawalService: PrivatePlanWithdrawalService
  ) {}

  /**
   * Saga that orchestrates the withdrawal process
   * Handles the complete flow from creation to completion or failure
   */

  /**
   * Safely adds a step to the withdrawal history with error handling and retry logic
   */
  private async safeAddStepToHistory(
    userId: string,
    accountId: string,
    withdrawalId: string,
    step: PrivatePlanWithdrawalStep,
    maxRetries: number = 3
  ): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await this.withdrawalService.addStepToHistory(userId, accountId, withdrawalId, step);
        this.logger.log(`✅ Step ${step} added to history for withdrawal ${withdrawalId}`);
        return; // Success, exit the retry loop
      } catch (error) {
        if (error.message.includes('not found')) {
          if (attempt < maxRetries) {
            this.logger.warn(
              `⚠️ Withdrawal ${withdrawalId} not found when trying to add step ${step}. Retrying in 100ms... (attempt ${attempt}/${maxRetries})`
            );
            await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100ms before retry
            continue;
          } else {
            this.logger.warn(
              `⚠️ Withdrawal ${withdrawalId} not found after ${maxRetries} attempts. This might be a race condition.`
            );
          }
        } else {
          this.logger.error(
            `❌ Failed to add step ${step} to history for withdrawal ${withdrawalId}: ${error.message}`,
            error.stack
          );
        }
        // Don't throw the error - let the saga continue
        return;
      }
    }
  }
  
  @Saga()
  withdrawalCreated = (events$: Observable<IEvent>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(WithdrawalCreatedEvent),
      tap(async (event: WithdrawalCreatedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Starting withdrawal process for ID: ${event.withdrawalId}`);
        // Don't add CREATED step here as it's already added during withdrawal creation
        // Just log that we're starting the saga process
      }),
      map((event: WithdrawalCreatedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Dispatching DebitAccountCommand for withdrawal: ${event.withdrawalId}`);
        return new DebitAccountCommand(
          event.userId,
          event.accountId,
          event.withdrawalId
        );
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in withdrawalCreated saga: ${error.message}`, error.stack);
        // Return a no-op command to prevent the saga from crashing
        return of(null);
      })
    );
  };

  @Saga()
  withdrawalInsufficientFunds = (events$: Observable<IEvent>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(WithdrawalInsufficientFundsEvent),
      tap((event: WithdrawalInsufficientFundsEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Received WithdrawalInsufficientFundsEvent for ID: ${event.withdrawalId}`);
        this.logger.log(`🔄 Withdrawal Saga: Withdrawal has insufficient funds for ID: ${event.withdrawalId}, Amount: ${event.amount}`);
      }),
      tap(async (event: WithdrawalInsufficientFundsEvent) => {
        try {
          // Wait a moment to ensure the withdrawal is available
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Add FAILED step to history
          await this.withdrawalService.addStepToHistory(
            event.userId,
            event.accountId,
            event.withdrawalId,
            PrivatePlanWithdrawalStep.FAILED
          );
          
          // Update the withdrawal step to FAILED
          await this.withdrawalService.updateWithdrawalStep(
            event.userId,
            event.accountId,
            event.withdrawalId,
            PrivatePlanWithdrawalStep.FAILED
          );
          
          this.logger.log(`✅ Withdrawal Saga: Successfully transitioned withdrawal ${event.withdrawalId} to FAILED`);
        } catch (error) {
          this.logger.error(`❌ Error transitioning withdrawal ${event.withdrawalId} to FAILED: ${error.message}`, error.stack);
        }
      }),
      map((event: WithdrawalInsufficientFundsEvent) => {
        return null; // No command to dispatch
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in withdrawalInsufficientFunds saga: ${error.message}`, error.stack);
        return of(null);
      })
    );
  };

  @Saga()
  withdrawalDebited = (events$: Observable<IEvent>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(WithdrawalDebitedEvent),
      tap(async (event: WithdrawalDebitedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Account debited, sending to bank for ID: ${event.withdrawalId}`);
        // Step history is now managed by command handlers, no need to add it here
      }),
      map((event: WithdrawalDebitedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Dispatching SendToBankCommand for withdrawal: ${event.withdrawalId}`);
        return new SendToBankCommand(
          event.withdrawalId,
          event.userId,
          event.accountId,
          event.amount,
          event.bankAccountId
        );
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in withdrawalDebited saga: ${error.message}`, error.stack);
        return of(null);
      })
    );
  };

  @Saga()
  withdrawalSentToBank = (events$: Observable<IEvent>): Observable<ICommand | undefined> => {
    return events$.pipe(
      ofType(WithdrawalSentToBankEvent),
      tap(async (event: WithdrawalSentToBankEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Withdrawal sent to bank, waiting for response for ID: ${event.withdrawalId}`);
        // Step history is now managed by command handlers, no need to add it here
      }),
      map((event: WithdrawalSentToBankEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Withdrawal sent to bank, waiting for response for ID: ${event.withdrawalId}`);
        // This would typically start a timeout or polling mechanism
        // For now, we'll just log that it's been sent
        return undefined; // No immediate command needed
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in withdrawalSentToBank saga: ${error.message}`, error.stack);
        return of(undefined);
      })
    );
  };

  @Saga()
  bankResponseReceived = (events$: Observable<IEvent>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(BankResponseReceivedEvent),
      tap(async (event: BankResponseReceivedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Bank response received for withdrawal ID: ${event.withdrawalId}, Status: ${event.status}`);
        // Step history is now managed by command handlers, no need to add it here
      }),
      map((event: BankResponseReceivedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Bank response successful, completing withdrawal for ID: ${event.withdrawalId}`);
        return new CompleteWithdrawalCommand(
          event.withdrawalId,
          event.userId,
          event.accountId,
          event.bankTransactionId
        );
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in bankResponseReceived saga: ${error.message}`, error.stack);
        return of(null);
      })
    );
  };

  @Saga()
  withdrawalRollingBack = (events$: Observable<IEvent>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(WithdrawalRollingBackEvent),
      tap((event: WithdrawalRollingBackEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Starting rollback for withdrawal ID: ${event.withdrawalId}, Reason: ${event.reason}`);
      }),
      map((event: WithdrawalRollingBackEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Dispatching RollbackDebitCommand for withdrawal ID: ${event.withdrawalId}`);
        return new RollbackDebitCommand(
          event.userId,
          event.accountId,
          event.withdrawalId
        );
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in withdrawalRollingBack saga: ${error.message}`, error.stack);
        return of(null);
      })
    );
  };

  @Saga()
  bankTransferCompleted = (events$: Observable<IEvent>): Observable<ICommand | null> => {
    return events$.pipe(
      ofType(BankTransferCompletedEvent),
      tap(async (event: BankTransferCompletedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Bank transfer completed, finalizing withdrawal for ID: ${event.withdrawalId}`);
        await this.safeAddStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.COMPLETED
        );
      }),
      map((event: BankTransferCompletedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Dispatching CompleteWithdrawalCommand for withdrawal: ${event.withdrawalId}`);
        return new CompleteWithdrawalCommand(
          event.withdrawalId,
          event.userId,
          event.accountId,
          event.transactionId
        );
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in bankTransferCompleted saga: ${error.message}`, error.stack);
        return of(null);
      })
    );
  };

  @Saga()
  withdrawalFailed = (events$: Observable<IEvent>): Observable<ICommand | undefined> => {
    return events$.pipe(
      ofType(WithdrawalFailedEvent),
      tap(async (event: WithdrawalFailedEvent) => {
        this.logger.log(`🔄 Withdrawal Saga: Withdrawal failed for ID: ${event.withdrawalId}, Reason: ${event.reason}`);
        await this.safeAddStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.FAILED
        );
      }),
      map((event: WithdrawalFailedEvent) => {
        // No command needed - this is the final step
        this.logger.log(`🔄 Withdrawal Saga: Withdrawal process completed with failure for ID: ${event.withdrawalId}`);
        return undefined;
      }),
      catchError((error) => {
        this.logger.error(`❌ Error in withdrawalFailed saga: ${error.message}`, error.stack);
        return of(undefined);
      })
    );
  };

}
