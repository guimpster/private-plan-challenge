import { Address } from './address';
import { BankAccount } from './bank-account';
import { PrivatePlanAccount } from './private-plan-account';
import { Source } from './source';

export type Gender = 'male' | 'female' | 'other';

export class User {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  gender: Gender;
  birthDate: string;
  address: Address;
  profession: string;
  source: Source;
  accounts: PrivatePlanAccount[];
  bankAccounts: BankAccount[];
  inactivated_at: Date | null;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
