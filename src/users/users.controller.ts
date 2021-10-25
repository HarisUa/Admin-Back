import { Controller, Get, Post, Body, Put, Param, Query, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';
import { UserModel } from '@shared/models';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserFiltersDto } from './dto/find-user-filters.dto';

/**
 * Controller for v1/users routes
 * @export
 * @class RolesController
 */
@Controller('v1/users')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Users')
export class UsersController {
  /**
   * Creates an instance of UsersController.
   * @param {UsersService} usersService used to serve users APIs
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * To create user
   * @param {CreateUserDto} createUserDto create user request
   * @param {UserModel} loggedInUser current user details
   * @return created user details
   */
  @Post()
  @ApiCreatedResponse({ description: 'blank object' })
  @ApiUnprocessableEntityResponse({ description: 'incorrect payload values, user with given email exist' })
  @Auth(PERMISSIONS.USERS_CREATE)
  async create(@Body() createUserDto: CreateUserDto, @User() loggedInUser: UserModel): Promise<CommonResponse> {
    await this.usersService.create(createUserDto, loggedInUser);

    return {};
  }

  /**
   * To get users based on filters
   * @param {FindUserFiltersDto} queryParams filter options
   * @return list of users
   */
  @Get()
  @ApiOkResponse({ description: 'users list' })
  @Auth(PERMISSIONS.USERS_INDEX)
  async findAll(@Query() queryParams: FindUserFiltersDto): Promise<CommonResponse> {
    const { users, totalUsers } = await this.usersService.findAll(queryParams);

    return { data: { users, total: totalUsers } };
  }

  /**
   * TO get one user
   * @param {string} userId user id to find
   * @return user details
   */
  @Get(':userId')
  @ApiOkResponse({ description: 'user details' })
  @ApiUnprocessableEntityResponse({ description: 'if user not found' })
  @Auth(PERMISSIONS.USERS_READ)
  async findOne(@Param('userId') userId: string): Promise<CommonResponse> {
    const user = await this.usersService.findOne(userId);
    return { data: { user } };
  }

  /**
   * To update user details and roles
   * @param {string} userId user id
   * @param {UpdateUserDto} updateUserDto update user details
   * @param {UserModel} loggedInUser current user
   * @return updated user details
   */
  @Put(':userId')
  @ApiOkResponse({ description: 'updated user details' })
  @ApiUnprocessableEntityResponse({ description: 'incorrect payload values,user not found' })
  @Auth(PERMISSIONS.USERS_UPDATE)
  async update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto, @User() loggedInUser: UserModel): Promise<CommonResponse> {
    const updatedUser = await this.usersService.update(userId, updateUserDto, loggedInUser);
    return { data: { user: updatedUser } };
  }

  /**
   * To delete user
   * @param {string} userId user to delete
   * @return ack message of delete user
   */
  @Delete(':userId')
  @ApiOkResponse({ description: 'ack message of user deleted' })
  @ApiUnprocessableEntityResponse({ description: 'if user not found' })
  @Auth(PERMISSIONS.USERS_DELETE)
  async delete(@Param('userId') userId: string): Promise<CommonResponse> {
    await this.usersService.delete(userId);
    return { message: 'user deleted' };
  }
}
