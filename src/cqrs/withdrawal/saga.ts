import { Injectable } from '@nestjs/common';
import { Saga, ofType } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AccountDebitedEvent, TransferFailedEvent, TransferSentEvent } from './events';
import { FinalizeWithdrawalCommand, NotifyUserCommand, RollbackDebitCommand, SendBankTransferCommand } from './commands';

@Injectable()
export class WithdrawalsSaga {
  @Saga()
  onAccountDebited = (events$: Observable<any>) =>
    events$.pipe(
      ofType(AccountDebitedEvent),
      map(e => new SendBankTransferCommand(e.withdrawalId)),
    );

  @Saga()
  onTransferSent = (events$: Observable<any>) =>
    events$.pipe(
      ofType(TransferSentEvent),
      mergeMap(e => [
        new FinalizeWithdrawalCommand(e.withdrawalId, true, e.bankTxnId),
        new NotifyUserCommand(e.withdrawalId, true),
      ]),
    );

  @Saga()
  onTransferFailed = (events$: Observable<any>) =>
    events$.pipe(
      ofType(TransferFailedEvent),
      mergeMap(e => [
        new RollbackDebitCommand(e.withdrawalId),
        new FinalizeWithdrawalCommand(e.withdrawalId, false, undefined, e.reason),
        new NotifyUserCommand(e.withdrawalId, false, e.reason),
      ]),
    );
}
