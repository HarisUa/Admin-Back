import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiSecurity } from '@nestjs/swagger';

import { AuthGuard } from '@shared/guards';

import { COMMON_HEADERS, PermissionsValues } from '../constants';

/**
 * Auth decorator to combine auth related decorator in one
 * @export
 * @param {...PermissionsValues[]} permissions permission to allow for user
 * @return composition of decorators related to auth
 */
export function Auth(...permissions: PermissionsValues[]) {
  // create swagger API doc error message to give propert idea about required permissions
  let forbiddenResourceErrorMessage = 'Forbidden resource';
  if (permissions.length) {
    forbiddenResourceErrorMessage += `, Need '${permissions.join(`','`)}' permissions`;
  }
  return applyDecorators(
    SetMetadata('permissions', permissions),
    UseGuards(AuthGuard),
    ApiSecurity(COMMON_HEADERS.X_ACCESS_TOKEN),
    ApiForbiddenResponse({ description: forbiddenResourceErrorMessage }),
  );
}
