export abstract class ValueObject {
  public equals(other: ValueObject): boolean {
    return JSON.stringify(this) === JSON.stringify(other);
  }
}

export class Money extends ValueObject {
  constructor(public readonly amount: number, public readonly currency: string = 'BRL') {
    super();
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot subtract money with different currencies');
    }
    if (this.amount < other.amount) {
      throw new Error('Insufficient funds for subtraction');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  public isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount > other.amount;
  }

  public isLessThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare money with different currencies');
    }
    return this.amount < other.amount;
  }
}

export class AccountId extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error('Account ID cannot be empty');
    }
  }
}

export class UserId extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error('User ID cannot be empty');
    }
  }
}

export class WithdrawalId extends ValueObject {
  constructor(public readonly value: string) {
    super();
    if (!value || value.trim().length === 0) {
      throw new Error('Withdrawal ID cannot be empty');
    }
  }
}
