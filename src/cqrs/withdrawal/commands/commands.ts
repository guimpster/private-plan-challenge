import { BusinessError } from "src/business/errors/errors";
import { Source } from "src/business/domain/entities/source";

export class CreateWithdrawalCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly bankAccountId: string,
    public readonly source: Source,
    public readonly amount: number
  ) {}
}

export class DebitAccountCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string
  ) {}
}

export class SendBankTransferCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string
  ) {}
}

export class ReceiveBankTransferCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string,
    public readonly success: boolean,
    public readonly error?: BusinessError,
  ) {}
}

export class RollbackDebitCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string
  ) {}
}

export class FinalizeWithdrawalCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string,
    public readonly success: boolean,
    public readonly bankTxnId?: string,
    public readonly reason?: string,
  ) {}
}

export class NotifyUserCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string,
    public readonly error: BusinessError,
  ) {}
}

// Additional commands for the saga
export class SendToBankCommand {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly bankAccountId: string
  ) {}
}

export class CompleteWithdrawalCommand {
  constructor(
    public readonly withdrawalId: string,
    public readonly userId: string,
    public readonly accountId: string,
    public readonly transactionId: string
  ) {}
}

export class RollbackWithdrawalCommand {
  constructor(
    public readonly withdrawalId: string,
    public readonly reason: string
  ) {}
}
