import { Global, Module, Provider, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';

import { HttpExceptionFilter, UnhandledExceptionFilter } from './filters';
import { ResponseInterceptor, LoggingInterceptor } from './interceptors';
import { RoleModel, UserModel, UserRoleModel } from './models';
import { AwsModule } from './modules';
import { SbBasicService } from './providers';

/**
 * Exception filters providers array
 ** Nest read providers from bottom to top,
 ** so remeber this order for exception filters.
 ** As changing order can create unexpected result
 */
const exceptionFiltersProviders: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: UnhandledExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
];

/**
 * Common interceptor providers array
 ** Nest read providers from bottom to top,
 ** so remeber this order for interceptors.
 ** As changing order can create unexpected result
 */
const commonInterceptors: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },
];

/**
 * Common pipes providers array
 ** Nest read providers from bottom to top,
 ** so remeber this order for interceptors.
 ** As changing order can create unexpected result
 */
const commonPipes: Provider[] = [
  {
    provide: APP_PIPE,
    useValue: new ValidationPipe({ transform: true, whitelist: true }),
  },
];

/**
 * sb betting services list to add in providers and exports for module
 */
const sbBettingServices = [SbBasicService];

@Global()
@Module({
  providers: [...exceptionFiltersProviders, ...commonInterceptors, ...commonPipes, ...sbBettingServices],
  imports: [SequelizeModule.forFeature([UserRoleModel, UserModel, RoleModel]), AwsModule],
  exports: [SequelizeModule, AwsModule, ...sbBettingServices],
})
export class SharedModule {}
