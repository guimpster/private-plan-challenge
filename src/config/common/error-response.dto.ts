import { BaseEntity } from 'src/business/common/base-entity';

export class ErrorResponseDto extends BaseEntity {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  validationErrors?: Array<{
    field: string;
    message: string;
  }>;
}
