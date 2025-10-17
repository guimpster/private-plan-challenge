import { Inject, Injectable, Logger } from '@nestjs/common';
import { IN_MEMORY_DB } from './db/in-memory-db';
import type { DBData } from './db/in-memory-db.entity';
import { PrivatePlanWithdrawalRepository } from 'src/business/repository/private-plan-withdrawal.repository';
import { PrivatePlanWithdrawal } from 'src/business/entities/private-plan-withdrawal';

@Injectable()
export class InMemoryPrivatePlanWithdrawalRepository extends PrivatePlanWithdrawalRepository {
    private readonly logger = new Logger(InMemoryPrivatePlanWithdrawalRepository.name);

    constructor(@Inject(IN_MEMORY_DB) private readonly db: DBData) {
        super();
    }

    create(privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal> {
        throw new Error('Method not implemented.');
    }

    updateById(id: string, privatePlanWithdrawal: PrivatePlanWithdrawal): Promise<PrivatePlanWithdrawal> {
        throw new Error('Method not implemented.');
    }
}