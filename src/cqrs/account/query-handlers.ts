import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAccountByIdQuery } from "./queries";
import { PrivatePlanAccountService } from "src/business/service/private-plan-account.service";
import { PrivatePlanAccount } from "src/business/domain/private-plan-account";

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdHandler implements IQueryHandler<GetAccountByIdQuery> {
  constructor(private readonly privatePlanAccountService: PrivatePlanAccountService) {}

  async execute(query: GetAccountByIdQuery): Promise<PrivatePlanAccount | undefined> {
    return this.privatePlanAccountService.findByUserId(query.userId, query.accountId);
  }
}
