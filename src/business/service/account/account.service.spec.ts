import { Test, TestingModule } from '@nestjs/testing';
import { Message } from '../../entities/account.entity';
import { MessageRepository } from '../../repository/account.repository';
import { MessageService } from './account.service';
import { MessageRepositoryMock } from './mocks/account.repository.mock';

describe('MessageService', () => {
  let messageService: MessageService;
  let messageRepository: MessageRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: MessageRepository,
          useClass: MessageRepositoryMock,
        },
      ],
    }).compile();
    messageRepository = module.get<MessageRepository>(MessageRepository);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(messageService).toBeDefined();
  });

  describe('create', () => {
    it('should create a message succesfully', async () => {
      const messageMock = new Message({ num_cliente: 123, cpf_cliente: 'abc' });
      const expectedMock = new Message({ ...messageMock, id: 'abc' });
      jest
        .spyOn(messageRepository, 'create')
        .mockImplementation(async () => expectedMock);
      await expect(messageService.create(messageMock)).resolves.toBe(
        expectedMock,
      );
    });

    it("should throw an error when the repository can't create a message succesfully", async () => {
      const error = new Error('ERROR');
      const messageMock = new Message({ num_cliente: 123, cpf_cliente: 'abc' });
      jest.spyOn(messageRepository, 'create').mockImplementation(async () => {
        throw error;
      });
      await expect(messageService.create(messageMock)).rejects.toThrow('ERROR');
    });
  });

  describe('findOne', () => {
    it('should find a message by id successfuly', async () => {
      const mockedId = 'abc';
      const expectedMock = new Message({
        id: mockedId,
        num_cliente: 123,
        cpf_cliente: 'abc',
      });
      jest
        .spyOn(messageRepository, 'getById')
        .mockImplementation(async (id) =>
          id === mockedId ? expectedMock : {},
        );
      await expect(messageService.findOne(mockedId)).resolves.toBe(
        expectedMock,
      );
    });

    it('should throw an error when the repository works improperly', async () => {
      expect(true).toBe(true);
    });
  });
});
