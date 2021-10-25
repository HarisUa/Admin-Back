import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Interceptor to log incoming request and response timing
 * @export
 * @class LoggingInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Logger to log the incoming request and response
   * @private
   */
  private readonly loggerService = new Logger('LoggingInterceptor');

  /**
   * To log incoming request
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @return {Observable<any>}
   */
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const id = uuid();
    const httpArgumentHost = context.switchToHttp();
    const request = httpArgumentHost.getRequest<Request>();
    const response = httpArgumentHost.getResponse<Response>();

    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.loggerService.log(`${id}  ${request.method}  ${request.path} ${response.statusCode} ${Date.now() - now}ms`);
      }),
    );
  }
}
