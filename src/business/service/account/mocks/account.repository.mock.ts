import { Message } from '../../../entities/account.entity';
import { MessageRepository } from '../../../repository/account.repository';

export class MessageRepositoryMock extends MessageRepository {
  public async create(message: Message): Promise<Message> {
    return new Message({});
  }

  public async getById(id: string): Promise<Message> {
    return new Message({});
  }
}
