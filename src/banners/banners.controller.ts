import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';
import { UserModel } from '@shared/models';

import { BannersService } from './banners.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { GetBannersQueryDto } from './dto/get-banners-query.dto';
import { ReorderBannersBodyDto } from './dto/reorder-banners-body.dto';

/**
 * Controller for v1/banner routes
 * @export
 * @class BannerController
 */
@Controller('v1/banners')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Banners')
export class BannersController {
  /**
   * Creates an instance of BannerController.
   * @param {BannersService} bannersService used to server banner apis
   */
  constructor(private readonly bannersService: BannersService) {}

  /**
   * To create banner
   * @param {CreateBannerDto} createBannerDto create request
   * @param {UserModel} userModel current user details
   * @return created banner details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created banner details' })
  @Auth(PERMISSIONS.BANNERS_CREATE)
  async create(@Body() createBannerDto: CreateBannerDto, @User() userModel: UserModel): Promise<CommonResponse> {
    const createdBanner = await this.bannersService.create(createBannerDto, userModel);

    return { data: { banner: createdBanner } };
  }

  /**
   * To get all banners
   * @return banners list
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'banners list' })
  @Auth(PERMISSIONS.BANNERS_INDEX)
  async findAll(@Query() queryParams: GetBannersQueryDto): Promise<CommonResponse> {
    const { banners, totalBanners } = await this.bannersService.findAll(queryParams);
    return { data: { banners, total: totalBanners } };
  }

  /**
   * To find statistics of banners
   * @return banner details
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found banner statistics' })
  @Auth(PERMISSIONS.BANNERS_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.bannersService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To find one banner
   * @param {string} bannerId banner id to find
   * @return banner details
   */
  @Get(':bannerId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found banner' })
  @Auth(PERMISSIONS.BANNERS_READ)
  async findOne(@Param('bannerId') bannerId: string): Promise<CommonResponse> {
    const banner = await this.bannersService.findOne(bannerId);
    return { data: { banner } };
  }

  /**
   * To reorder specific banner
   * @param {string} bannerId banner to update
   * @param {ReorderBannersBodyDto} reorderBody update request body
   * @param {string} userId curret user id
   * @return updated banners details
   */
  @Put('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'reordered banners list and their sort orders' })
  @ApiOperation({ summary: 'to reorder banners' })
  @Auth(PERMISSIONS.BANNERS_UPDATE)
  async reorderBanners(@Body() reorderBody: ReorderBannersBodyDto): Promise<CommonResponse> {
    const { banners } = await this.bannersService.reorderBanners(reorderBody);
    return { data: { banners } };
  }

  /**
   * TO update banner details
   * @param {string} bannerId id of banner
   * @param {UpdateBannerDto} updateBannerDto update banner request
   * @param {string} userId id of current user
   * @return update banner details response
   */
  @Put(':bannerId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated banner details' })
  @Auth(PERMISSIONS.BANNERS_UPDATE)
  async update(
    @Param('bannerId') bannerId: string,
    @Body() updateBannerDto: UpdateBannerDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const banner = await this.bannersService.update(bannerId, updateBannerDto, userId);
    return { data: { banner } };
  }

  /**
   * To delete banner
   * @param {string} bannerId id of banner
   * @return ack of banner deleted response
   */
  @Delete(':bannerId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of banner deleted' })
  @Auth(PERMISSIONS.BANNERS_DELETE)
  async remove(@Param('bannerId') bannerId: string): Promise<CommonResponse> {
    await this.bannersService.remove(bannerId);
    return { message: 'banner removed' };
  }
}
