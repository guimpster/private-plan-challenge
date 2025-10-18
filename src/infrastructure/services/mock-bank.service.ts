import { Injectable } from '@nestjs/common';
import { BankService } from '../../business/domain/services/bank.service';
import { Result } from '../../business/common';
import { BankTransferError } from '../../business/errors/errors';

@Injectable()
export class MockBankService extends BankService {
  async sendTransfer(userId: string, bankAccountId: string, amount: number): Promise<Result<null, BankTransferError>> {
    // Mock implementation - in a real scenario, this would call actual bank APIs
    console.log(`Mock bank transfer: User ${userId}, Account ${bankAccountId}, Amount ${amount}`);
    
    // Simulate success for now
    return {
      ok: true,
      value: null
    };
  }
}
