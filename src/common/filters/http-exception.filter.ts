import {
  Logger,
  Catch,
  HttpException,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { X_REQUEST_ID_HEADER } from '../constants/request.constants';
import { randomUUID } from 'crypto';
import { ErrorCode } from '../errors/error-codes';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestId = request.header(X_REQUEST_ID_HEADER) ?? randomUUID();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      response.status(status).json({
        requestId,
        timestamp: new Date().toISOString(),
        ...(typeof payload === 'string'
          ? { code: ErrorCode.BAD_REQUEST, message: payload }
          : payload),
      });
      return;
    }

    this.logger.error('Unhandled exception', exception as Error);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      requestId,
      timestamp: new Date().toISOString(),
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Unexpected error',
    });
  }
}
