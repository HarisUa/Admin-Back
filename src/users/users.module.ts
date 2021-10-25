import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserMapper } from './user.mapper';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserMapper],
})
export class UsersModule {}
