import { Result } from "../common";
import { BankTransferError } from "../errors/errors";

export interface BankService {
    sendTransfer(userId: string, bankAccountId: string, amount: number): Promise<Result<null, BankTransferError>>;
}