export abstract class BusinessError extends Error {}


export class NotEnoughFunds extends BusinessError {
  name = 'NotEnoughFunds';
}

export class BankTransferError extends BusinessError {
  name = 'BankTransferError';
}

export class UserNotFoundError extends BusinessError {
  name = 'UserNotFoundError';
}

export class AccountNotFoundError extends BusinessError {
  name = 'AccountNotFoundError';
}

export class WithdrawalNotFoundError extends BusinessError {
  name = 'WithdrawalNotFoundError';
}

export class CouldNotTransferError extends BusinessError {
  name = 'CouldNotTransferError';
}