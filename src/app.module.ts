import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PortsModule } from './ports/ports.module';

@Module({
  imports: [
    ConfigModule.register({ type: 'json' }),
    PortsModule.register({ database: 'inMemory' }),
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
