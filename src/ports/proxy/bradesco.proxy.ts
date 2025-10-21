import { Injectable } from '@nestjs/common';
import { BankService } from '../../business/domain/services/bank.service';
import { Result } from '../../business/common/index';
import { BankTransferError } from '../../business/errors/errors';

@Injectable()
export class BradescoProxy extends BankService {
  async sendTransfer(userId: string, bankAccountId: string, amount: number): Promise<Result<null, BankTransferError>> {
    // Bradesco API implementation - in a real scenario, this would call actual Bradesco APIs
    console.log(`Bradesco transfer: User ${userId}, Account ${bankAccountId}, Amount ${amount}`);
    
    // Simulate success for now
    return {
      ok: true,
      value: null
    };
  }
}
