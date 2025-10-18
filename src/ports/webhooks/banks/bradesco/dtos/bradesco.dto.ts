import { BaseEntity } from 'src/business/common/base-entity';

export class BradescoWebHookDto extends BaseEntity {
  userId: string;
  accountId: string;
  withdrawalId: string;
  success: boolean;
  error: string;
}
