import { IsString, IsNumber, IsNotEmpty, Min, IsOptional } from 'class-validator';
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
  @Min(1) // Minimum 1 cent instead of 0.01
  @IsOptional()
  amount?: number; // Amount in cents (integer)
}

export class WithdrawalResponseDto {
  id: string;
  userId: string;
  accountId: string;
  bankAccountId: string;
  amount: number; // Amount in cents (integer)
  status: string;
  created_at: Date;
  stepHistory: { step: string; stepRetrialCount: number; at: Date }[];
  notifications: { type: 'SUCCESS' | 'FAILURE'; message: string; sentAt: Date; userId: string }[];

  constructor(partial: Partial<WithdrawalResponseDto>) {
    Object.assign(this, partial);
  }
}
