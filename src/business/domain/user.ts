import { Address } from './address';
import { BankAccount } from './bank-account';
import { PrivatePlanAccount } from './private-plan-account';
import { Source } from './source';
import { BaseEntity } from '../common/base-entity';

export type Gender = 'male' | 'female' | 'other';

export class User extends BaseEntity {
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
}
