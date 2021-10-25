import { Controller, Get, Post, Body, Put, Param, Delete, HttpStatus, HttpCode, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { SubBannersService } from './sub-banners.service';
import { CreateSubBannerDto } from './dto/create-sub-banner.dto';
import { UpdateSubBannerDto } from './dto/update-sub-banner.dto';
import { GetSubBannerQueryDto } from './dto/get-sub-banner-query.dto';
import { ReorderSubBannersBodyDto } from './dto/reorder-sub-banners-body.dto';

/**
 * Controller for v1/sub-banners routes
 * @export
 * @class SubBannersController
 */
@Controller('v1/sub-banners')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Sub Banners')
export class SubBannersController {
  /**
   * Creates an instance of BannerController.
   * @param {SubBannersService} subBannersService used to server sub-banners apis
   */
  constructor(private readonly subBannersService: SubBannersService) {}

  /**
   * To create subbanner
   * @param {CreateSubBannerDto} createSubBannerDto create sub banner request
   * @param {string} userId
   * @return create sub banner data response
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Created sub banner details' })
  @Auth(PERMISSIONS.SUB_BANNERS_CREATE)
  async create(@Body() createSubBannerDto: CreateSubBannerDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdSubBanner = await this.subBannersService.create(createSubBannerDto, userId);
    return { data: { subBanner: createdSubBanner } };
  }

  /**
   * To get multiple sub banners based on filter
   * @param {GetSubBannerQueryDto} queryParams
   * @return sub-banners and total count based on filter
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'sub-banners list' })
  @Auth(PERMISSIONS.SUB_BANNERS_INDEX)
  async findAll(@Query() queryParams: GetSubBannerQueryDto): Promise<CommonResponse> {
    const { subBanners, totalSubBanners } = await this.subBannersService.findAll(queryParams);
    return { data: { subBanners, total: totalSubBanners } };
  }

  /**
   * To find statistics of sub-banners
   * @return sub-banners statistics
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found sub-banners statistics' })
  @Auth(PERMISSIONS.SUB_BANNERS_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.subBannersService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To get one sub banner
   * @param {string} subBannerId
   * @return sub details
   */
  @Get(':subBannerId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'sub-banner details' })
  @Auth(PERMISSIONS.SUB_BANNERS_READ)
  async findOne(@Param('subBannerId') subBannerId: string): Promise<CommonResponse> {
    const subBanner = await this.subBannersService.findOne(subBannerId);
    return { data: { subBanner } };
  }

  /**
   * To reorder specific subbanner
   * @param {string} subBannerId sub banner to update
   * @param {ReorderSubBannersBodyDto} reorderBody update request body
   * @param {string} userId currect user id
   * @return updated sub banner details
   */
  @Put('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'reordered sub-banners list and their sort orders' })
  @ApiOperation({ summary: 'to reorder sub banners' })
  @Auth(PERMISSIONS.SUB_BANNERS_UPDATE)
  async reorderSubBanners(@Body() reorderBody: ReorderSubBannersBodyDto): Promise<CommonResponse> {
    const { subBanners } = await this.subBannersService.reorderSubBanners(reorderBody);
    return { data: { subBanners } };
  }

  /**
   * To update spefic subbanner
   * @param {string} subBannerId sub banner to update
   * @param {UpdateSubBannerDto} updateSubBannerDto update request body
   * @param {string} userId curret user id
   * @return updated sub banner details
   */
  @Put(':subBannerId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated sub-banner details' })
  @Auth(PERMISSIONS.SUB_BANNERS_UPDATE)
  async update(
    @Param('subBannerId') subBannerId: string,
    @Body() updateSubBannerDto: UpdateSubBannerDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const updatedSubBanner = await this.subBannersService.update(subBannerId, updateSubBannerDto, userId);
    return { data: { subBanner: updatedSubBanner } };
  }

  /**
   * To delete sub banner
   * @param {string} subBannerId to delete sub banner
   * @return ack of sub banner deleted response
   */
  @Delete(':subBannerId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of sub-banner deleted' })
  @Auth(PERMISSIONS.SUB_BANNERS_DELETE)
  async remove(@Param('subBannerId') subBannerId: string): Promise<CommonResponse> {
    await this.subBannersService.remove(subBannerId);
    return { message: 'sub banner removed' };
  }
}
