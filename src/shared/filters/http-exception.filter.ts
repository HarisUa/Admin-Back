import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

/**
 * handles thrown http exception
 * @export
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * method to handle exception
   * @param {HttpException} exception exception object
   * @param {ArgumentsHost} host host object to fetch context
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const expResponse = ctx.getResponse<Response>();
    const errResponse = exception.getResponse();
    let message = exception.message;

    // check whether error is validation error or not
    const isValdationError = typeof errResponse === 'object' && Array.isArray(errResponse['message']);

    /**
     * if message is an array then give first message
     ** That means its validation pipe error from class-validator
     */
    if (isValdationError) {
      message = errResponse['message'][0];
    }

    // do not transform uppercase of first character of validation error message
    if (!isValdationError && typeof message === 'string') {
      message = message.charAt(0).toUpperCase() + message.slice(1);
    }

    expResponse.status(exception.getStatus()).json({
      isError: true,
      message,
      code: exception.getStatus(),
    });
  }
}
