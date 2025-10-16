import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AccountModule } from './api/account/account.module';

@Module({
  imports: [
    AccountModule,
    ConfigModule.register({ type: 'json' }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
