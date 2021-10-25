import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { UserModel } from '@shared/models';
import { CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, Auth, User } from '@common';

import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * Controller for v1/roles routes
 * @export
 * @class RolesController
 */
@Controller('v1/roles')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Roles')
export class RolesController {
  /**
   * Creates an instance of RolesController.
   * @param {RolesService} rolesService used to server roles apis
   */
  constructor(private readonly rolesService: RolesService) {}

  /**
   * To create role
   * @param {CreateRoleDto} createRoleDto create request
   * @param {UserModel} loggedInUser current user details
   * @return created role
   */
  @Post()
  @ApiCreatedResponse({ description: 'created role' })
  @ApiUnprocessableEntityResponse({ description: 'incorrect values of payload, role with given name already exist' })
  @Auth(PERMISSIONS.ROLES_CREATE)
  async create(@Body() createRoleDto: CreateRoleDto, @User() loggedInUser: UserModel): Promise<CommonResponse> {
    const createdRole = await this.rolesService.create(createRoleDto, loggedInUser);
    return { data: { role: createdRole } };
  }

  /**
   * To get all roles
   * @return get roles
   */
  @Get()
  @ApiOkResponse({ description: 'list of roles' })
  @Auth(PERMISSIONS.ROLES_INDEX)
  async findAll(): Promise<CommonResponse> {
    const roles = await this.rolesService.findAll();
    return { data: { roles } };
  }

  /**
   * To get permissions list
   * @return permissions list
   */
  @Get('permissions')
  @ApiOkResponse({ description: 'available permissions' })
  @Auth(PERMISSIONS.ROLES_INDEX)
  async permissions(): Promise<CommonResponse> {
    const permissions = Object.values(PERMISSIONS);
    return { data: { permissions } };
  }

  /**
   * To get roles for roles dropdown
   * @return roles to use in dropdown
   */
  @Get('dropdown')
  @ApiOkResponse({ description: 'to get roles for roles dropdown' })
  @Auth(PERMISSIONS.ROLES_INDEX)
  async rolesDropdown(): Promise<CommonResponse> {
    const roles = await this.rolesService.rolesDropdown();
    return { data: { roles } };
  }

  /**
   * To get all roles
   * @return get roles
   */
  @Get(':roleId')
  @ApiOkResponse({ description: 'role details' })
  @ApiUnprocessableEntityResponse({ description: 'role with given role id not found' })
  @Auth(PERMISSIONS.ROLES_READ)
  async findOne(@Param('roleId') roleId: string): Promise<CommonResponse> {
    const role = await this.rolesService.findOne(+roleId);
    return { data: { role } };
  }

  /**
   * To update role
   * @param {string} roleId role id of role
   * @param {UpdateRoleDto} updateRoleDto update request
   * @param {UserModel} loggedInUser current user details
   * @return updated role
   */
  @Put(':roleId')
  @ApiOkResponse({ description: 'role updated' })
  @ApiUnprocessableEntityResponse({ description: 'incorect values of payload, role with given role id not found' })
  @Auth(PERMISSIONS.ROLES_UPDATE)
  async update(@Param('roleId') roleId: string, @Body() updateRoleDto: UpdateRoleDto, @User() loggedInUser: UserModel): Promise<CommonResponse> {
    const updatedRole = await this.rolesService.update(+roleId, updateRoleDto, loggedInUser);
    return { data: { role: updatedRole } };
  }

  /**
   * To delete role
   * @param {string} roleId role id
   * @return ack message of role deleted
   */
  @Delete(':roleId')
  @ApiOkResponse({ description: 'ack message of role delete' })
  @ApiUnprocessableEntityResponse({ description: 'role with given role id not found' })
  @Auth(PERMISSIONS.ROLES_DELETE)
  async delete(@Param('roleId') roleId: string): Promise<CommonResponse> {
    await this.rolesService.delete(+roleId);
    return { message: 'role deleted' };
  }
}
