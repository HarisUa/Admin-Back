import _ from 'lodash';

/**
 * headers which are used for common purpose
 */
export const SB_COMMON_HEADERS = {
  REQUEST_LANGUAGE: 'request-language',
};

/**
 * common headers values array
 */
export const SB_COMMON_HEADERS_ARRAY = _.values(SB_COMMON_HEADERS);

/**
 * supported language codes
 */
export enum LANGUAGE_CODES {
  PL = 'pl',
  EN = 'en',
  UK = 'uk',
}

/**
 * default language code to use if not provided
 */
export const DEFAULT_LANGUAGE_CODE = LANGUAGE_CODES.PL;

/**
 * array of language codes
 */
export const LANGUAGE_CODES_ARRAY = Object.values(LANGUAGE_CODES);

/**
 * event types
 */
export const EVENT_TYPES = {
  PREMATCH: 1,
  LIVE: 2,
  SPECIAL: 3,
};