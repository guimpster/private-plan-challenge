export class BradescoWebHookDto {
  userId: string;
  accountId: string;
  withdrawalId: string;
  success: boolean;
  error: string;

  constructor(partial: Partial<BradescoWebHookDto>) {
    Object.assign(this, partial);
  }
}
