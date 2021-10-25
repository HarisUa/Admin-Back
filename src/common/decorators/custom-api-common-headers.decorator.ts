import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

import { SB_COMMON_HEADERS, SB_COMMON_HEADERS_ARRAY, DEFAULT_LANGUAGE_CODE, LANGUAGE_CODES } from '../constants';

/**
 * To set custom common headers to api
 * @export
 * @param {...string[]} headersToSet header name to set in api
 * @return applied decorator composition
 */
export function CustomApiCommonHeaders(...headersToSet: string[]) {
  const decoratorsToSet: (ClassDecorator | MethodDecorator | PropertyDecorator)[] = [];

  // if headers to set not provided then set all headers as default
  if (!headersToSet.length) {
    headersToSet = SB_COMMON_HEADERS_ARRAY;
  }

  // set request language header if header name provided
  if (headersToSet.includes(SB_COMMON_HEADERS.REQUEST_LANGUAGE)) {
    decoratorsToSet.push(
      ApiHeader({
        name: SB_COMMON_HEADERS.REQUEST_LANGUAGE,
        required: true,
        description: 'Language in which response needed. If incorrect language code or no code provided then default language code PL will be use',
        //! Note: Once @nestjs/swagger provide correct enum type then remove as any
        schema: { default: DEFAULT_LANGUAGE_CODE, enum: LANGUAGE_CODES as any },
      }),
    );
  }

  return applyDecorators(...decoratorsToSet);
}
