import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PortsModule } from './ports/port.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [
    ConfigModule.register({ type: 'json' }),
    InfrastructureModule,
    PortsModule.register({ database: 'inMemory' }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
