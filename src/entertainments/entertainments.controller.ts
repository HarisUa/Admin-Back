import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { EntertainmentsService } from './entertainments.service';
import { CreateEntertainmentDto } from './dto/create-entertainment.dto';
import { UpdateEntertainmentDto } from './dto/update-entertainment.dto';
import { GetEntertainmentQueryDto } from './dto/get-entertainment-query.dto';
import { ReorderEntertainmentsBodyDto } from './dto/reorder-entertainments-body.dto';

/**
 * Controller for v1/entertainments routes
 * @export
 * @class EntertainmentsController
 */
@Controller('v1/entertainments')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Entertainments')
export class EntertainmentsController {
  /**
   * Creates an instance of EntertainmentsController.
   * @param {EntertainmentsService} entertainmentsService used to serve entertainment apis
   */
  constructor(private readonly entertainmentsService: EntertainmentsService) {}

  /**
   * To create entertainment
   * @param {CreateEntertainmentDto} createEntertainmentDto create entertainment details
   * @param {string} userId current user id
   * @return created entertainment details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created entertainment details' })
  @Auth(PERMISSIONS.ENTERTAINMENT_CREATE)
  async create(@Body() createEntertainmentDto: CreateEntertainmentDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdEntertainment = await this.entertainmentsService.create(createEntertainmentDto, userId);

    return { data: { entertainment: createdEntertainment } };
  }

  /**
   * To get entertainments based on filters
   * @param {GetEntertainmentQueryDto} queryParams
   * @return entertainments list
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'entertainments list' })
  @Auth(PERMISSIONS.ENTERTAINMENT_INDEX)
  async findAll(@Query() queryParams: GetEntertainmentQueryDto): Promise<CommonResponse> {
    const { entertainments, totalEntertainments } = await this.entertainmentsService.findAll(queryParams);

    return { data: { entertainments, total: totalEntertainments } };
  }

  /**
   * To find statistics of entertainments
   * @return entertainments statistics
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found entertainments statistics' })
  @Auth(PERMISSIONS.ENTERTAINMENT_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.entertainmentsService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To get one entertainment
   * @param {string} entertainmentId entertainment to fetch
   * @return entertainment details
   */
  @Get(':entertainmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'entertainment details' })
  @Auth(PERMISSIONS.ENTERTAINMENT_READ)
  async findOne(@Param('entertainmentId') entertainmentId: string): Promise<CommonResponse> {
    const entertainment = await this.entertainmentsService.findOne(entertainmentId);
    return { data: { entertainment } };
  }

  /**
   * To reorder specific entertainment
   * @param {string} entertainmentId entertainment to update
   * @param {ReorderEntertainmentsBodyDto} reorderBody update request body
   * @param {string} userId current user id
   * @return updated entertainments details
   */
  @Put('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'reordered entertainments list and their sort orders' })
  @ApiOperation({ summary: 'to reorder entertainments' })
  @Auth(PERMISSIONS.ENTERTAINMENT_UPDATE)
  async reorderEntertainments(@Body() reorderBody: ReorderEntertainmentsBodyDto): Promise<CommonResponse> {
    const { entertainments } = await this.entertainmentsService.reorderEntertainments(reorderBody);
    return { data: { entertainments } };
  }

  /**
   * To update entertainment
   * @param {string} entertainmentId entertainment id
   * @param {UpdateEntertainmentDto} updateEntertainmentDto update entertainment request
   * @param {string} userId current user id
   * @return updated entertainment details
   */
  @Put(':entertainmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated entertainment details' })
  @Auth(PERMISSIONS.ENTERTAINMENT_UPDATE)
  async update(
    @Param('entertainmentId') entertainmentId: string,
    @Body() updateEntertainmentDto: UpdateEntertainmentDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const updatedEntertainment = await this.entertainmentsService.update(entertainmentId, updateEntertainmentDto, userId);

    return { data: { entertainment: updatedEntertainment } };
  }

  /**
   * To delete entertainment
   * @param {string} entertainmentId entertainment id to delete
   * @return ack message response of entertainment deleted
   */
  @Delete(':entertainmentId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of entertainment deleted' })
  @Auth(PERMISSIONS.ENTERTAINMENT_DELETE)
  async remove(@Param('entertainmentId') entertainmentId: string): Promise<CommonResponse> {
    await this.entertainmentsService.remove(entertainmentId);
    return { message: 'entertainment removed' };
  }
}
