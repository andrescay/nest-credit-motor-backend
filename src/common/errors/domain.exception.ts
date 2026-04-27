import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes';

export class DomainException extends HttpException {
  constructor(
    status: HttpStatus,
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(
      {
        code,
        message,
        details,
      },
      status,
    );
  }
}
