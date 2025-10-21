import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { Logger } from "@nestjs/common";
import { CreateWithdrawalCommand, DebitAccountCommand, FinalizeWithdrawalCommand, NotifyUserCommand, ReceiveBankTransferCommand, RollbackDebitCommand, SendBankTransferCommand, SendToBankCommand, CompleteWithdrawalCommand } from "./commands";
import { PrivatePlanWithdrawalService } from "src/business/domain/services/private-plan-withdrawal.service";
import { NotificationService } from "src/business/domain/services/notification.service";
import { PrivatePlanWithdrawal, PrivatePlanWithdrawalStep } from "src/business/domain/entities/private-plan-withdrawal";
import { WithdrawalDebitedEvent } from "../events/withdrawal-debited.event";
import { WithdrawalSentToBankEvent } from "../events/withdrawal-sent-to-bank.event";
import { WithdrawalInsufficientFundsEvent } from "../events/withdrawal-insufficient-funds.event";

@CommandHandler(CreateWithdrawalCommand)
export class CreateWithdrawalHandler implements ICommandHandler<CreateWithdrawalCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: CreateWithdrawalCommand): Promise<PrivatePlanWithdrawal> {
    return this.privatePlanWithdrawalService.createWithdrawal(
      command.userId,
      command.accountId,
      command.bankAccountId,
      command.source,
      command.amount
    );
  }
}

@CommandHandler(DebitAccountCommand)
export class DebitAccountHandler implements ICommandHandler<DebitAccountCommand> {
  private readonly logger = new Logger(DebitAccountHandler.name);

  constructor(
    private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: DebitAccountCommand): Promise<void> {
    await this.privatePlanWithdrawalService.debitAccount(command.userId, command.accountId, command.withdrawalId);
    
    // Get the withdrawal to check if the debit was successful
    const withdrawal = await this.privatePlanWithdrawalService.getWithdrawalById(
      command.userId, 
      command.accountId, 
      command.withdrawalId
    );
    
    if (withdrawal) {
      this.logger.log(`🔍 DebitAccountHandler: Withdrawal ${command.withdrawalId} is in step: ${withdrawal.step}`);
      if (withdrawal.step === PrivatePlanWithdrawalStep.SENDING_TO_BANK) {
        // Debit was successful, emit WithdrawalDebitedEvent
        this.logger.log(`✅ DebitAccountHandler: Emitting WithdrawalDebitedEvent for withdrawal ${command.withdrawalId}`);
        this.eventBus.publish(
          new WithdrawalDebitedEvent(
            command.withdrawalId,
            command.userId,
            command.accountId,
            withdrawal.amount,
            withdrawal.destinationBankAccountId,
            new Date()
          )
        );
      } else if (withdrawal.step === PrivatePlanWithdrawalStep.INSUFFICIENT_FUNDS) {
        // Debit failed due to insufficient funds, emit WithdrawalInsufficientFundsEvent
        this.logger.log(`❌ DebitAccountHandler: Emitting WithdrawalInsufficientFundsEvent for withdrawal ${command.withdrawalId}`);
        this.eventBus.publish(
          new WithdrawalInsufficientFundsEvent(
            command.withdrawalId,
            command.userId,
            command.accountId,
            withdrawal.amount,
            new Date()
          )
        );
        
        // Immediately transition to FAILED
        this.logger.log(`🔄 DebitAccountHandler: Transitioning withdrawal ${command.withdrawalId} to FAILED`);
        await this.privatePlanWithdrawalService.addStepToHistory(
          command.userId,
          command.accountId,
          command.withdrawalId,
          PrivatePlanWithdrawalStep.FAILED
        );
        await this.privatePlanWithdrawalService.updateWithdrawalStep(
          command.userId,
          command.accountId,
          command.withdrawalId,
          PrivatePlanWithdrawalStep.FAILED
        );
      }
    } else {
      this.logger.log(`❌ DebitAccountHandler: Withdrawal ${command.withdrawalId} not found`);
    }
  }
}

@CommandHandler(SendBankTransferCommand)
export class SendBankTransferHandler implements ICommandHandler<SendBankTransferCommand> {
  constructor(
    private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: SendBankTransferCommand): Promise<void> {
    await this.privatePlanWithdrawalService.sendBankTransfer(command.userId, command.accountId, command.withdrawalId);
    
    // Get the withdrawal to emit the event with all necessary data
    const withdrawal = await this.privatePlanWithdrawalService.getWithdrawalById(
      command.userId, 
      command.accountId, 
      command.withdrawalId
    );
    
    if (withdrawal) {
      this.eventBus.publish(
        new WithdrawalSentToBankEvent(
          command.withdrawalId,
          command.userId,
          command.accountId,
          withdrawal.destinationBankAccountId,
          withdrawal.amount,
          new Date()
        )
      );
    }
  }
}

@CommandHandler(SendToBankCommand)
export class SendToBankHandler implements ICommandHandler<SendToBankCommand> {
  constructor(
    private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService,
    private readonly eventBus: EventBus
  ) {}

  async execute(command: SendToBankCommand): Promise<void> {
    // Update step to SENDING_TO_BANK and add to history
    await this.privatePlanWithdrawalService.addStepToHistory(
      command.userId, 
      command.accountId, 
      command.withdrawalId, 
      PrivatePlanWithdrawalStep.SENDING_TO_BANK
    );
    
    await this.privatePlanWithdrawalService.sendBankTransfer(
      command.userId, 
      command.accountId, 
      command.withdrawalId
    );
    
    this.eventBus.publish(
      new WithdrawalSentToBankEvent(
        command.withdrawalId,
        command.userId,
        command.accountId,
        command.bankAccountId,
        command.amount,
        new Date()
      )
    );
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
    // Add RECEIVED_BANK_RESPONSE step to history first
    await this.privatePlanWithdrawalService.addStepToHistory(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.RECEIVED_BANK_RESPONSE
    );

    // Add ROLLING_BACK step to history
    await this.privatePlanWithdrawalService.addStepToHistory(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.ROLLING_BACK
    );

    // Update the withdrawal step to ROLLING_BACK
    await this.privatePlanWithdrawalService.updateWithdrawalStep(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.ROLLING_BACK
    );
    
    // Execute the rollback (credits the account and updates step to FAILED)
    await this.privatePlanWithdrawalService.rollbackDebit(command.userId, command.accountId, command.withdrawalId);
    
    // Add FAILED step to history
    await this.privatePlanWithdrawalService.addStepToHistory(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.FAILED
    );
  }
}

@CommandHandler(CompleteWithdrawalCommand)
export class CompleteWithdrawalHandler implements ICommandHandler<CompleteWithdrawalCommand> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(command: CompleteWithdrawalCommand): Promise<void> {
    // Add RECEIVED_BANK_RESPONSE step to history first
    await this.privatePlanWithdrawalService.addStepToHistory(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.RECEIVED_BANK_RESPONSE
    );

    // Add COMPLETED step to history
    await this.privatePlanWithdrawalService.addStepToHistory(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.COMPLETED
    );

    // Update the withdrawal step to COMPLETED
    await this.privatePlanWithdrawalService.updateWithdrawalStep(
      command.userId,
      command.accountId,
      command.withdrawalId,
      PrivatePlanWithdrawalStep.COMPLETED
    );
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
      await this.privatePlanWithdrawalService.finalizeWithdrawalFailure(withdrawalId, reason || 'Unknown error');
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
