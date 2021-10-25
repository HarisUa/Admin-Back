import { IncomingHttpHeaders } from 'http';
import { LANGUAGE_CODES } from '../constants';

/**
 * Common interface for all responses
 * @export
 * @interface CommonResponse
 * @template T
 */
export interface CommonResponse<T = any> {
  message?: string;
  data?: T;
  code?: number;
  headers?: IncomingHttpHeaders;
}

/**
 * Common headers to use for sb betting APIs
 * @export
 * @interface CommonHeadersInterface
 * @extends {IncomingHttpHeaders}
 */
export interface CommonHeadersInterface extends IncomingHttpHeaders {
  'request-language'?: LANGUAGE_CODES;
}
