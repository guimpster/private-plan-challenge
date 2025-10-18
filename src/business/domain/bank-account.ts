export enum BankAccountName {
    BRADESCO = 'Bradesco',
    ITAU = 'Itaú',
    CAIXA = 'Caixa Econômica Federal',
};

export class BankAccount {
    id: string;
    userId: string;
    bankAccountType: 'checking' | 'savings';
    name: BankAccountName;
    code: string;
    agencyNumber: string;
    accountNumber: string;
    accountDigit: string;

    constructor(partial: Partial<BankAccount>) {
        Object.assign(this, partial);
    }
};
