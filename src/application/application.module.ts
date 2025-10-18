import { Module } from '@nestjs/common';
import { AccountApplicationService } from './services/account-application-service';
import { PrivatePlanAccountRepository } from '../business/repository/private-plan-account.repository';
import { InMemoryPrivatePlanAccountRepository } from '../repository/in-memory/in-memory-private-plan-account.repository';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';

@Module({
  imports: [InfrastructureModule],
  providers: [
    AccountApplicationService,
    {
      provide: PrivatePlanAccountRepository,
      useExisting: InMemoryPrivatePlanAccountRepository,
    },
  ],
  exports: [AccountApplicationService],
})
export class ApplicationModule {}
