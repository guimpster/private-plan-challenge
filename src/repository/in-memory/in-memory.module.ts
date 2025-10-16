import { Module } from '@nestjs/common';
import { InMemoryAccountRepository } from './in-memory.account.repository';


@Module({
  imports: [],
  providers: [InMemoryAccountRepository],
  exports: [InMemoryAccountRepository],
})
export class InMemoryModule {}
