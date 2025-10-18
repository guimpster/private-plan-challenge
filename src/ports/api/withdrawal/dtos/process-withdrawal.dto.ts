import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { BaseEntity } from 'src/business/common/base-entity';

export class CreateWithdrawalDto extends BaseEntity {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsString()
  @IsNotEmpty()
  bankAccountId: string;

  @IsNumber()
  @Min(0.01)
  amount: number;
}

export class WithdrawalResponseDto extends BaseEntity {
  id: string;
  userId: string;
  accountId: string;
  bankAccountId: string;
  amount: number;
  status: string;
  created_at: Date;
}
