import { ApiProperty } from '@nestjs/swagger';

export class AccountDto {
  @ApiProperty({
    description: 'Unique account identifier',
    example: 'acc_123456789'
  })
  id: string;

  @ApiProperty({
    description: 'Cash available for withdrawal',
    example: 1000.50,
    minimum: 0
  })
  cashAvailableForWithdrawal: number;

  @ApiProperty({
    description: 'Total cash balance',
    example: 1500.75,
    minimum: 0
  })
  cashBalance: number;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2023-10-18T14:30:00.000Z'
  })
  created_at: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-10-18T15:45:00.000Z'
  })
  updated_at: Date;

  constructor(partial: Partial<AccountDto>) {
    Object.assign(this, partial);
  }
}
