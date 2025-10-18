import { BaseEntity } from "../common/base-entity";

export enum BankAccountName {
    BRADESCO = 'Bradesco',
    ITAU = 'Itaú',
    CAIXA = 'Caixa Econômica Federal',
};

export class BankAccount extends BaseEntity {
    id: string;
    userId: string;
    bankAccountType: 'checking' | 'savings';
    name: BankAccountName;
    code: string;
    agencyNumber: string;
    accountNumber: string;
    accountDigit: string;
};
