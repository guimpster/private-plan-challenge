import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetWithdrawalByIdQuery } from './queries';
import { PrivatePlanWithdrawalService } from '../../../business/domain/services/private-plan-withdrawal.service';
import { PrivatePlanWithdrawal } from '../../../business/domain/entities/private-plan-withdrawal';

@QueryHandler(GetWithdrawalByIdQuery)
export class GetWithdrawalByIdHandler implements IQueryHandler<GetWithdrawalByIdQuery> {
  constructor(private readonly privatePlanWithdrawalService: PrivatePlanWithdrawalService) {}

  async execute(query: GetWithdrawalByIdQuery): Promise<PrivatePlanWithdrawal | undefined> {
    return this.privatePlanWithdrawalService.getWithdrawalById(
      query.userId,
      query.accountId,
      query.withdrawalId
    );
  }
}
