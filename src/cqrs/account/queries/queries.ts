export class GetAccountByIdQuery {
  constructor(
    public readonly userId: string,
    public readonly accountId: string
  ) {}
}
