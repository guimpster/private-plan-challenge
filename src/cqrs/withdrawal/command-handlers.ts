import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DebitAccountCommand, FinalizeWithdrawalCommand, NotifyUserCommand, RollbackDebitCommand, SendBankTransferCommand } from "./commands";
import { PrivatePlanWithdrawalService } from "src/business/service/private-plan-withdrawal.service";

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler implements ICommandHandler<DebitAccountCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: DebitAccountCommand): Promise<void> {
    await this.privatePlanWithdrawalService.debitAccount(command.withdrawalId);
  }
}

@CommandHandler(SendBankTransferCommand)
export class SendBankTransferHandler implements ICommandHandler<SendBankTransferCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: SendBankTransferCommand): Promise<void> {
    await this.privatePlanWithdrawalService.sendBankTransfer(command.withdrawalId);
  }
}

@CommandHandler(RollbackDebitCommand)
export class RollbackDebitHandler implements ICommandHandler<RollbackDebitCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: RollbackDebitCommand): Promise<void> {
    await this.privatePlanWithdrawalService.rollbackDebit(command.withdrawalId);
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
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: NotifyUserCommand): Promise<void> {
    const { withdrawalId, success, reason } = command;
    if (success) {
      await this.privatePlanWithdrawalService.notifyUserOfSuccess(withdrawalId);
    } else {
      await this.privatePlanWithdrawalService.notifyUserOfFailure(withdrawalId, reason);
    }
  }
}
