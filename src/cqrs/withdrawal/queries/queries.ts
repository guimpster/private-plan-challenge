export class GetWithdrawalByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string
  ) {}
}
