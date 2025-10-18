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
    public readonly success: boolean,
    public readonly reason?: string,
  ) {}
}
