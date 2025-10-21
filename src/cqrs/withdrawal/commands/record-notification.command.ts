export class RecordNotificationCommand {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly withdrawalId: string,
    public readonly type: 'SUCCESS' | 'FAILURE',
    public readonly message: string
  ) {}
}
