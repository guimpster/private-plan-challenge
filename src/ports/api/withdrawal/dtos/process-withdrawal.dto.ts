import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateWithdrawalDto {
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

  constructor(partial: Partial<CreateWithdrawalDto>) {
    Object.assign(this, partial);
  }
}

export class WithdrawalResponseDto {
  id: string;
  userId: string;
  accountId: string;
  bankAccountId: string;
  amount: number;
  status: string;
  created_at: Date;

  constructor(partial: Partial<WithdrawalResponseDto>) {
    Object.assign(this, partial);
  }
}
