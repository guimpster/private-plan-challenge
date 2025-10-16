import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { ElasticModule } from '../../repository/elasticsearch/elastic.module';
import { MessageService } from 'src/business/service/account/account.service';
import { MessageRepository } from 'src/business/repository/account.repository';
import { ElasticMessageRepository } from 'src/repository/elasticsearch/elastic.message.repository';

@Module({
  imports: [ElasticModule],
  providers: [
    MessageService,
    {
      provide: MessageRepository,
      useExisting: ElasticMessageRepository,
    },
  ],
  controllers: [AccountController],
})
export class AccountModule {}
