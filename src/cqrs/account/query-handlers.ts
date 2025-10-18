import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetAccountByIdQuery } from "./queries";
import { AccountApplicationService } from "src/application/services/account-application-service";
import { PrivatePlanAccount } from "src/business/domain/entities/private-plan-account";

@QueryHandler(GetAccountByIdQuery)
export class GetAccountByIdHandler implements IQueryHandler<GetAccountByIdQuery> {
  constructor(private readonly accountApplicationService: AccountApplicationService) {}

  async execute(query: GetAccountByIdQuery): Promise<PrivatePlanAccount | undefined> {
    return this.accountApplicationService.getAccount({
      userId: query.userId,
      accountId: query.accountId
    });
  }
}
