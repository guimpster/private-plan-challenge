import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import * as QueryHandlers from './query-handlers';
import { ApplicationModule } from 'src/application/application.module';

@Module({
  imports: [CqrsModule, ApplicationModule],
  providers: [
    ...Object.values(QueryHandlers).filter(v => typeof v === 'function'),
  ],
  exports: [CqrsModule],
})
export class AccountCqrsModule {}
