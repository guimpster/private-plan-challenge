export class ErrorResponseDto {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;

  constructor(partial: Partial<ErrorResponseDto>) {
    Object.assign(this, partial);
  }
}

export class ValidationErrorResponseDto extends ErrorResponseDto {
  validationErrors?: Array<{
    field: string;
    message: string;
  }>;
}
