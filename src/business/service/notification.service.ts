import { BusinessError } from "../errors/errors";

export interface NotificationService {
    notifyUserOfSuccess(withdrawalId: string): Promise<void>;
    notifyUserOfFailure(userId: string, accountId: string, withdrawalId: string, errors: BusinessError): Promise<void>;
}
