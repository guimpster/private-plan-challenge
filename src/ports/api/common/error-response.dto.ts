import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed'
  })
  message: string;

  @ApiProperty({
    description: 'Error type',
    example: 'BadRequestException'
  })
  error: string;

  @ApiProperty({
    description: 'Timestamp of the error',
    example: '2023-10-18T14:30:00.000Z'
  })
  timestamp: string;

  @ApiProperty({
    description: 'Request path',
    example: '/api/v1/accounts/123'
  })
  path: string;

  constructor(partial: Partial<ErrorResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  @ApiProperty({
    description: 'Validation error details',
    example: [
      {
        field: 'amount',
        message: 'Amount must be greater than 0'
      }
    ]
  })
  validationErrors?: Array<{
    field: string;
    message: string;
  }>;
}
