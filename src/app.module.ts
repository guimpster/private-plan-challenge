import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TriggerModule } from './api/account/account.module';
import { MessageModule } from './api/message/message.module';
import { OrchestratorModule } from './api/orchestrator/orchestrator.module';

@Module({
  imports: [
    TriggerModule,
    MessageModule,
    ConfigModule.register({ type: 'json' }),
    OrchestratorModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
