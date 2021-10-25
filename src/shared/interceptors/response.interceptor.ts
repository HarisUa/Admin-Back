import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import _ from 'lodash';

import { CommonResponse } from '@common';
import { Response } from 'express';

/**
 * Response interface for all request
 * @export
 * @interface ResponseInterface
 * @extends {CommonResponse}
 */
export interface ResponseInterface extends CommonResponse {
  isError: boolean;
}

/**
 * Response interceptor for all requests
 * @export
 * @class ResponseInterceptor
 * @implements {NestInterceptor<T, ResponseInterface>}
 * @template T
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ResponseInterface> {
  /**
   * Use to handle request and response
   * @param {ExecutionContext} context
   * @param {CallHandler} next
   * @return {Observable<ResponseInterface>}
   */
  intercept(context: ExecutionContext, next: CallHandler<CommonResponse>): Observable<ResponseInterface> {
    const httpArgumentHost = context.switchToHttp();
    const response = httpArgumentHost.getResponse<Response>();

    return next.handle().pipe(
      map((resData) => {
        const resHeaders = resData.headers;
        const restData = _.omit(resData, 'headers');

        response.set(resHeaders || {});

        return { isError: false, code: HttpStatus.OK, ...restData };
      }),
    );
  }
}
