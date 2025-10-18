export class BradescoWebHookDto {
  id: string;
  cashAvailableForWithdrawal: number;
  cashBalance: number;
  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<BradescoDto>) {
    Object.assign(this, partial);
  }
}
