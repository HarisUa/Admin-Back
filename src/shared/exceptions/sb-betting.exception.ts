import { HttpException } from '@nestjs/common';

import { CommonHeadersInterface } from '@common';

/**
 * To create sb betting custom exception
 * @export
 * @class SbBettingException
 * @extends {HttpException}
 */
export class SbBettingException extends HttpException {
  /**
   * Creates an instance of SbBettingException.
   * @param {Record<string, any>} responseBody response body to send for error details
   */
  constructor(responseBody: Record<string, any>, headers: CommonHeadersInterface) {
    const errorData = {
      body: {
        code: responseBody.code,
        message: responseBody.description,
        data: responseBody.data,
      },
      headers,
    };
    super(errorData, errorData.body.code);
  }
}
