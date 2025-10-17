import { Injectable } from '@nestjs/common';

import { PrivatePlanAccount } from '../entities/private-plan-account';
import { PrivatePlanAccountRepository } from '../repository/private-plan-account.repository';

@Injectable()
export class PrivatePlanAccountService {
  constructor(private readonly privatePlanAccountRepository: PrivatePlanAccountRepository) {}

  // TODO: check if user is authenticated and has permissions
  async findByUserId(userId: string, id: string): Promise<PrivatePlanAccount | undefined> {
    return this.privatePlanAccountRepository.getByUserId(userId, id);
  }
}
