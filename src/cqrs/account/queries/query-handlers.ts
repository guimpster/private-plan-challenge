import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAccountByIdQuery } from "./queries";
import { PrivatePlanAccountService } from "src/business/domain/services/private-plan-account.service";
import { PrivatePlanAccount } from "src/business/domain/entities/private-plan-account";

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdHandler implements IQueryHandler<GetAccountByIdQuery> {
  constructor(private readonly privatePlanAccountService: PrivatePlanAccountService) {}

  async execute(query: GetAccountByIdQuery): Promise<PrivatePlanAccount | undefined> {
    return this.privatePlanAccountService.getAccount({
      userId: query.userId,
      accountId: query.accountId
    });
  }
}
