export class WithdrawalRequestedEvent {
  constructor(public readonly withdrawalId: string) {}
}

export class AccountDebitedEvent {
  constructor(public readonly withdrawalId: string) {}
}

export class TransferSentEvent {
  constructor(public readonly withdrawalId: string, public readonly bankTxnId: string) {}
}

export class TransferFailedEvent {
  constructor(public readonly withdrawalId: string, public readonly reason: string) {}
}

export class WithdrawalRolledBackEvent {
  constructor(public readonly withdrawalId: string) {}
}
