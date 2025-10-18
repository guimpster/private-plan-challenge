import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/business/common/base-entity';

export class BradescoWebHookDto extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  withdrawalId: string;

  @IsBoolean()
  success: boolean;

  @IsString()
  error: string;
}
