import { Result } from "../common";
import { BankTransferError } from "../errors/errors";

export abstract class BankService {
    abstract sendTransfer(userId: string, bankAccountId: string, amount: number): Promise<Result<null, BankTransferError>>;
}