import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { MybetService } from './mybet.service';
import { CreateMybetDto } from './dto/create-mybet.dto';
import { UpdateMybetDto } from './dto/update-mybet.dto';
import { GetMybetQueryDto } from './dto/get-mybet-query.dto';

/**
 * Controller for v1/message routes
 * @export
 * @class MessagesController
 */
@Controller('v1/my-bet')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Mybet')
export class MybetController {
  /**
   * Creates an instance of MessagesController.
   * @param {MybetService} mybetService use to serve messages APIs
   */
  constructor(private readonly mybetService: MybetService) {}

  /**
   * To create message
   * @param {CreateMybetDto} createMybetDto create message request
   * @param {string} userId userid of current user
   * @returns {Promise<CommonResponse>} created message details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created message details' })
  @Auth(PERMISSIONS.MYBET_CREATE)
  async create(@Body() createMybetDto: CreateMybetDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdMybet = await this.mybetService.create(createMybetDto, userId);

    return { data: { message: createdMybet } };
  }

  /**
   * To get messages based on filters
   * @param {GetMybetQueryDto} queryParams
   * @return {Promise<CommonResponse>} messages list
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'mybet list' })
  @Auth(PERMISSIONS.MYBET_INDEX)
  async findAll(@Query() queryParams: GetMybetQueryDto): Promise<CommonResponse> {
    const { mybets, totalMybets } = await this.mybetService.findAll(queryParams);

    return { data: { mybets, total: totalMybets } };
  }

  /**
   * To find statistics of messages
   * @return messages statistics
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found mybet statistics' })
  @Auth(PERMISSIONS.MYBET_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.mybetService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To get list object of message dropdowns
   * @returns {Promise<CommonResponse>} message dropdown list object
   */
  // @Get('mybet-dropdowns')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({ description: 'all message dropdown list' })
  // @Auth(PERMISSIONS.MYBET_READ)
  // async getMybetDropdown(): Promise<CommonResponse> {
  //   const { promotions } = await this.mybetService.getMybetDropdown();

  //   return { data: { promotions } };
  // }

  /**
   * To get one message details
   * @param {string} mybetId mybet id
   * @returns {Promise<CommonResponse>} message details
   */
  @Get(':mybetId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'mybet details' })
  @Auth(PERMISSIONS.MYBET_READ)
  async findOne(@Param('mybetId') mybetId: string): Promise<CommonResponse> {
    const mybet = await this.mybetService.findOne(mybetId);
    return { data: { mybet } };
  }

  /**
   * TO update message details
   * @param {string} mybetId message id
   * @param {UpdateMessageDto} updateMybetDto message details to update
   * @param {string} userId current user id
   * @returns {Promise<CommonResponse>} updated message details
   */
  @Put(':mybetId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated message details' })
  @Auth(PERMISSIONS.MYBET_UPDATE)
  async update(
    @Param('mybetId') mybetId: string,
    @Body() updateMybetDto: UpdateMybetDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const mybet = await this.mybetService.update(mybetId, updateMybetDto, userId);

    return { data: { mybet } };
  }

  /**
   * To delete message
   * @param {string} mybetId id of message
   * @param {string} userId user id of current user
   * @returns {Promise<CommonResponse>} ack message
   */
  @Delete(':mybetId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of mybet deleted' })
  @Auth(PERMISSIONS.MYBET_DELETE)
  async remove(@Param('mybetId') mybetId: string, @User('userId') userId: string): Promise<CommonResponse> {
    await this.mybetService.remove(mybetId, userId);
    return { message: 'Mybet deleted' };
  }
}
