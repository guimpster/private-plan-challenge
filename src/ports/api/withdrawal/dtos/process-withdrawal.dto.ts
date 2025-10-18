import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min, IsUUID } from 'class-validator';

export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'User identifier',
    example: 'user_123456789'
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Account identifier',
    example: 'acc_123456789'
  })
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty({
    description: 'Bank account identifier for withdrawal destination',
    example: 'bank_987654321'
  })
  @IsString()
  @IsNotEmpty()
  bankAccountId: string;

  @ApiProperty({
    description: 'Withdrawal amount',
    example: 500.00,
    minimum: 0.01
  })
  @IsNumber()
  @Min(0.01)
  amount: number;

  constructor(partial: Partial<CreateWithdrawalDto>) {
    Object.assign(this, partial);
  }
}

export class WithdrawalResponseDto {
  @ApiProperty({
    description: 'Withdrawal identifier',
    example: 'withdrawal_123456789'
  })
  id: string;

  @ApiProperty({
    description: 'User identifier',
    example: 'user_123456789'
  })
  userId: string;

  @ApiProperty({
    description: 'Account identifier',
    example: 'acc_123456789'
  })
  accountId: string;

  @ApiProperty({
    description: 'Bank account identifier',
    example: 'bank_987654321'
  })
  bankAccountId: string;

  @ApiProperty({
    description: 'Withdrawal amount',
    example: 500.00
  })
  amount: number;

  @ApiProperty({
    description: 'Current withdrawal status',
    example: 'CREATED',
    enum: ['CREATED', 'DEBITING', 'SENDING_TO_BANK', 'COMPLETED', 'FAILED', 'ROLLING_BACK', 'INSUFFICIENT_FUNDS']
  })
  status: string;

  @ApiProperty({
    description: 'Withdrawal creation timestamp',
    example: '2023-10-18T14:30:00.000Z'
  })
  created_at: Date;

  constructor(partial: Partial<WithdrawalResponseDto>) {
    Object.assign(this, partial);
  }
}
