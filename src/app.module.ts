import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PortsModule } from './ports/ports.module';
import { JobsModule } from './jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.register({ type: 'json' }),
    PortsModule.register({ database: 'inMemory' }),
    JobsModule,
  ],
  providers: [],
  controllers: [],
})
export class AppModule {}
