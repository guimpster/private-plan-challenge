import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DebitAccountCommand, FinalizeWithdrawalCommand, NotifyUserCommand, ReceiveBankTransferCommand, RollbackDebitCommand, SendBankTransferCommand } from "./commands";
import { PrivatePlanWithdrawalService } from "src/business/service/private-plan-withdrawal.service";
import { NotificationService } from "src/business/service/notification.service";

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler implements ICommandHandler<DebitAccountCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: DebitAccountCommand): Promise<void> {
    await this.privatePlanWithdrawalService.debitAccount(command.userId, command.accountId, command.withdrawalId);
  }
}

@CommandHandler(SendBankTransferCommand)
export class SendBankTransferHandler implements ICommandHandler<SendBankTransferCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: SendBankTransferCommand): Promise<void> {
    await this.privatePlanWithdrawalService.sendBankTransfer(command.userId, command.accountId, command.withdrawalId);
  }
}

@CommandHandler(ReceiveBankTransferCommand)
export class ReceiveBankTransferHandler implements ICommandHandler<ReceiveBankTransferCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: ReceiveBankTransferCommand): Promise<void> {
    await this.privatePlanWithdrawalService.receiveBankTransferNotification(command.userId, command.accountId, command.withdrawalId, command.success, command.error);
  }
}

@CommandHandler(RollbackDebitCommand)
export class RollbackDebitHandler implements ICommandHandler<RollbackDebitCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: RollbackDebitCommand): Promise<void> {
    await this.privatePlanWithdrawalService.rollbackDebit(command.userId, command.accountId, command.withdrawalId);
  }
}

@CommandHandler(FinalizeWithdrawalCommand)
export class FinalizeWithdrawalHandler implements ICommandHandler<FinalizeWithdrawalCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: FinalizeWithdrawalCommand): Promise<void> {
    const { withdrawalId, success, bankTxnId, reason } = command;
    if (success) {
      await this.privatePlanWithdrawalService.finalizeWithdrawalSuccess(withdrawalId, bankTxnId!);
    } else {
      await this.privatePlanWithdrawalService.finalizeWithdrawalFailure(withdrawalId, reason);
    }
  }
}

@CommandHandler(NotifyUserCommand)
export class NotifyUserHandler implements ICommandHandler<NotifyUserCommand> {
  constructor(private readonly notificationService: NotificationService) {}

  async execute(command: NotifyUserCommand): Promise<void> {
    if (command.error) {
      await this.notificationService.notifyUserOfSuccess(command.userId, command.accountId, command.withdrawalId);
    } else {
      await this.notificationService.notifyUserOfFailure(command.userId, command.accountId, command.withdrawalId, command.error);
    }
  }
}
