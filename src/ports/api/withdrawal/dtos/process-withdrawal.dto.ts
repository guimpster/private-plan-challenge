export class ProcessWithdrawalDto {
  userId: string;
  accountId: string;
  bankAccountId: string;
  amount: number;

  constructor(partial: Partial<ProcessWithdrawalDto>) {
    Object.assign(this, partial);
  }
}
