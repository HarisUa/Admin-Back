import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

import { INTERNAL_SERVER_ERROR } from '@common';

/**
 * Handle unhandled errors
 * @export
 * @class UnhandledExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch(Error)
export class UnhandledExceptionFilter implements ExceptionFilter {
  /**
   * Logger instance to log unhandled error
   * @private
   */
  private readonly loggerService = new Logger('UnhandledError');

  /**
   * method to handle exception
   * @param {HttpException} exception exception object
   * @param {ArgumentsHost} host host object to fetch context
   */
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    this.loggerService.error(exception.message, exception.stack, exception.name);

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ isError: true, message: INTERNAL_SERVER_ERROR, code: HttpStatus.INTERNAL_SERVER_ERROR });
  }
}
