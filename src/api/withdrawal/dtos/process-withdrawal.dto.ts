export class ProcessWithdrawalDto {
  userId: string;
  accountId: string;
  amount: number;

  constructor(partial: Partial<ProcessWithdrawalDto>) {
    Object.assign(this, partial);
  }
}
