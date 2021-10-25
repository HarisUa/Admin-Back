import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { GetMessageQueryDto } from './dto/get-message-query.dto';

/**
 * Controller for v1/message routes
 * @export
 * @class MessagesController
 */
@Controller('v1/messages')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Messages')
export class MessagesController {
  /**
   * Creates an instance of MessagesController.
   * @param {MessagesService} messagesService use to serve messages APIs
   */
  constructor(private readonly messagesService: MessagesService) {}

  /**
   * To create message
   * @param {CreateMessageDto} createMessageDto create message request
   * @param {string} userId userid of current user
   * @returns {Promise<CommonResponse>} created message details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created message details' })
  @Auth(PERMISSIONS.MESSAGE_CREATE)
  async create(@Body() createMessageDto: CreateMessageDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdMessage = await this.messagesService.create(createMessageDto, userId);

    return { data: { message: createdMessage } };
  }

  /**
   * To get messages based on filters
   * @param {GetMessageQueryDto} queryParams
   * @return {Promise<CommonResponse>} messages list
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'messages list' })
  @Auth(PERMISSIONS.MESSAGE_INDEX)
  async findAll(@Query() queryParams: GetMessageQueryDto): Promise<CommonResponse> {
    const { messages, totalMessages } = await this.messagesService.findAll(queryParams);

    return { data: { messages, total: totalMessages } };
  }

  /**
   * To find statistics of messages
   * @return messages statistics
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found messages statistics' })
  @Auth(PERMISSIONS.ENTERTAINMENT_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.messagesService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To get list object of message dropdowns
   * @returns {Promise<CommonResponse>} message dropdown list object
   */
  @Get('message-dropdowns')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'all message dropdown list' })
  @Auth(PERMISSIONS.MESSAGE_READ)
  async getMessagesDropdown(): Promise<CommonResponse> {
    const { promotions } = await this.messagesService.getMessagesDropdown();

    return { data: { promotions } };
  }

  /**
   * To get one message details
   * @param {string} messageId message id
   * @returns {Promise<CommonResponse>} message details
   */
  @Get(':messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'message details' })
  @Auth(PERMISSIONS.MESSAGE_READ)
  async findOne(@Param('messageId') messageId: string): Promise<CommonResponse> {
    const message = await this.messagesService.findOne(messageId);
    return { data: { message } };
  }

  /**
   * TO update message details
   * @param {string} messageId message id
   * @param {UpdateMessageDto} updateMessageDto message details to update
   * @param {string} userId current user id
   * @returns {Promise<CommonResponse>} updated message details
   */
  @Put(':messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated message details' })
  @Auth(PERMISSIONS.MESSAGE_UPDATE)
  async update(
    @Param('messageId') messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const message = await this.messagesService.update(messageId, updateMessageDto, userId);

    return { data: { message } };
  }

  /**
   * To delete message
   * @param {string} messageId id of message
   * @param {string} userId user id of current user
   * @returns {Promise<CommonResponse>} ack message
   */
  @Delete(':messageId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of message deleted' })
  @Auth(PERMISSIONS.MESSAGE_DELETE)
  async remove(@Param('messageId') messageId: string, @User('userId') userId: string): Promise<CommonResponse> {
    await this.messagesService.remove(messageId, userId);
    return { message: 'Message deleted' };
  }
}
