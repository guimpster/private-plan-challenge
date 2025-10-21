import { Injectable } from '@nestjs/common';
import { ICommand, IEvent, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WithdrawalCreatedEvent } from '../events/withdrawal-created.event';
import { DebitAccountCommand } from '../commands/commands';
import { WithdrawalDebitedEvent } from '../events/withdrawal-debited.event';
import { SendToBankCommand } from '../commands/commands';
import { WithdrawalSentToBankEvent } from '../events/withdrawal-sent-to-bank.event';
import { BankResponseReceivedEvent } from '../events/bank-response-received.event';
import { WithdrawalRollingBackEvent } from '../events/withdrawal-rolling-back.event';
import { BankTransferCompletedEvent } from '../events/bank-transfer-completed.event';
import { CompleteWithdrawalCommand } from '../commands/commands';
import { WithdrawalFailedEvent } from '../events/withdrawal-failed.event';
import { RollbackWithdrawalCommand } from '../commands/commands';
import { WithdrawalStepHistoryService } from '../../../business/domain/services/withdrawal-step-history.service';
import { PrivatePlanWithdrawalStep } from '../../../business/domain/entities/private-plan-withdrawal';

@Injectable()
export class WithdrawalSaga {
  constructor(
    private readonly stepHistoryService: WithdrawalStepHistoryService
  ) {}

  /**
   * Saga that orchestrates the withdrawal process
   * Handles the complete flow from creation to completion or failure
   */
  
  @Saga()
  withdrawalCreated = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WithdrawalCreatedEvent),
      tap(async (event: WithdrawalCreatedEvent) => {
        console.log('🔄 Withdrawal Saga: Starting withdrawal process for ID:', event.withdrawalId);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.CREATED
        );
      }),
      map((event: WithdrawalCreatedEvent) => {
        return new DebitAccountCommand(
          event.userId,
          event.accountId,
          event.withdrawalId
        );
      })
    );
  };

  @Saga()
  withdrawalDebited = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WithdrawalDebitedEvent),
      tap(async (event: WithdrawalDebitedEvent) => {
        console.log('🔄 Withdrawal Saga: Account debited, sending to bank for ID:', event.withdrawalId);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.DEBITING
        );
      }),
      map((event: WithdrawalDebitedEvent) => {
        return new SendToBankCommand(
          event.withdrawalId,
          event.amount,
          event.bankAccountId
        );
      })
    );
  };

  @Saga()
  withdrawalSentToBank = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WithdrawalSentToBankEvent),
      tap(async (event: WithdrawalSentToBankEvent) => {
        console.log('🔄 Withdrawal Saga: Withdrawal sent to bank, waiting for response for ID:', event.withdrawalId);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.SENDING_TO_BANK
        );
      }),
      map((event: WithdrawalSentToBankEvent) => {
        // This would typically start a timeout or polling mechanism
        // For now, we'll just log that it's been sent
        return null; // No immediate command needed
      })
    );
  };

  @Saga()
  bankResponseReceived = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(BankResponseReceivedEvent),
      tap(async (event: BankResponseReceivedEvent) => {
        console.log('🔄 Withdrawal Saga: Bank response received for withdrawal ID:', event.withdrawalId, 'Status:', event.status);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.RECEIVED_BANK_RESPONSE
        );
      }),
      map((event: BankResponseReceivedEvent) => {
        console.log('🔄 Withdrawal Saga: Bank response successful, completing withdrawal for ID:', event.withdrawalId);
        return new CompleteWithdrawalCommand(
          event.withdrawalId,
          event.bankTransactionId
        );
      })
    );
  };

  @Saga()
  withdrawalRollingBack = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WithdrawalRollingBackEvent),
      tap(async (event: WithdrawalRollingBackEvent) => {
        console.log('🔄 Withdrawal Saga: Starting rollback for withdrawal ID:', event.withdrawalId, 'Reason:', event.reason);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.ROLLING_BACK
        );
      }),
      map((event: WithdrawalRollingBackEvent) => {
        console.log('🔄 Withdrawal Saga: Executing rollback command for withdrawal ID:', event.withdrawalId);
        return new RollbackWithdrawalCommand(
          event.withdrawalId,
          `Bank transfer failed: ${event.reason}`
        );
      })
    );
  };

  @Saga()
  bankTransferCompleted = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(BankTransferCompletedEvent),
      tap(async (event: BankTransferCompletedEvent) => {
        console.log('🔄 Withdrawal Saga: Bank transfer completed, finalizing withdrawal for ID:', event.withdrawalId);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.COMPLETED
        );
      }),
      map((event: BankTransferCompletedEvent) => {
        return new CompleteWithdrawalCommand(
          event.withdrawalId,
          event.transactionId
        );
      })
    );
  };

  @Saga()
  withdrawalFailed = (events$: Observable<IEvent>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WithdrawalFailedEvent),
      tap(async (event: WithdrawalFailedEvent) => {
        console.log('🔄 Withdrawal Saga: Withdrawal failed for ID:', event.withdrawalId, 'Reason:', event.reason);
        await this.stepHistoryService.addStepToHistory(
          event.userId,
          event.accountId,
          event.withdrawalId,
          PrivatePlanWithdrawalStep.FAILED
        );
      }),
      map((event: WithdrawalFailedEvent) => {
        // No command needed - this is the final step
        console.log('🔄 Withdrawal Saga: Withdrawal process completed with failure for ID:', event.withdrawalId);
        return null;
      })
    );
  };
}
