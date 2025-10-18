import { BusinessError } from "src/business/errors/errors";

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
