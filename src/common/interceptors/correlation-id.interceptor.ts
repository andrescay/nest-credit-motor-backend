import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import { X_REQUEST_ID_HEADER } from '../constants/request.constants';

@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const requestId = request.header(X_REQUEST_ID_HEADER) ?? randomUUID();
    response.setHeader(X_REQUEST_ID_HEADER, requestId);
    return next.handle();
  }
}
