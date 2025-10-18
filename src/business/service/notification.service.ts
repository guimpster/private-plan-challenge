import { BusinessError } from "../errors/errors";

export abstract class NotificationService {
    abstract notifyUserOfSuccess(withdrawalId: string): Promise<void>;
    abstract notifyUserOfFailure(userId: string, accountId: string, withdrawalId: string, errors: BusinessError): Promise<void>;
}
