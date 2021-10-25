import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, Query, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { GetPromotionQueryDto } from './dto/get-promotion-query.dto';
import { ReorderPromotionsBodyDto } from './dto/reorder-promotions-body.dto';

/**
 * Controller for v1/promotions routes
 * @export
 * @class PromotionsController
 */
@Controller('v1/promotions')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Promotions')
export class PromotionsController {
  /**
   * Creates an instance of PromotionsController.
   * @param {PromotionsService} promotionsService used to serve promotion apis
   */
  constructor(private readonly promotionsService: PromotionsService) {}

  /**
   * To create promotion
   * @param {CreatePromotionDto} createPromotionDto create promotion details
   * @param {string} userId current user id
   * @return created promotion details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created Promotion details' })
  @Auth(PERMISSIONS.PROMOTION_CREATE)
  async create(@Body() createPromotionDto: CreatePromotionDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdPromotion = await this.promotionsService.create(createPromotionDto, userId);

    return { data: { promotion: createdPromotion } };
  }

  /**
   * To get promotions based on filters
   * @param {GetPromotionQueryDto} queryParams
   * @return promotions list
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'promotions list' })
  @Auth(PERMISSIONS.PROMOTION_INDEX)
  async findAll(@Query() queryParams: GetPromotionQueryDto): Promise<CommonResponse> {
    const { promotions, totalPromotions } = await this.promotionsService.findAll(queryParams);

    return { data: { promotions, total: totalPromotions } };
  }

  /**
   * To find statistics of promotions
   * @return promotions statistics
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found promotions statistics' })
  @Auth(PERMISSIONS.ENTERTAINMENT_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.promotionsService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To get one promotion
   * @param {string} promotionId promotion to fetch
   * @return promotion details
   */
  @Get(':promotionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'promotion details' })
  @Auth(PERMISSIONS.PROMOTION_READ)
  async findOne(@Param('promotionId') promotionId: string): Promise<CommonResponse> {
    const promotion = await this.promotionsService.findOne(promotionId);
    return { data: { promotion } };
  }

  /**
   * To reorder specific promotion
   * @param {string} promotionId promotion to update
   * @param {ReorderPromotionsBodyDto} reorderBody update request body
   * @param {string} userId current user id
   * @return updated promotions details
   */
  @Put('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'reordered promotions list and their sort orders' })
  @ApiOperation({ summary: 'to reorder promotions' })
  @Auth(PERMISSIONS.PROMOTION_UPDATE)
  async reorderPromotions(@Body() reorderBody: ReorderPromotionsBodyDto): Promise<CommonResponse> {
    const { promotions } = await this.promotionsService.reorderPromotions(reorderBody);
    return { data: { promotions } };
  }

  /**
   * To update promotion
   * @param {string} promotionId promotion id
   * @param {UpdatePromotionDto} updatePromotionDto update promotion request
   * @param {string} userId current user id
   * @return updated entertainment details
   */
  @Put(':promotionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated entertainment details' })
  @Auth(PERMISSIONS.PROMOTION_UPDATE)
  async update(
    @Param('promotionId') promotionId: string,
    @Body() updatePromotionDto: UpdatePromotionDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const updatedPromotion = await this.promotionsService.update(promotionId, updatePromotionDto, userId);

    return { data: { promotion: updatedPromotion } };
  }

  /**
   * To delete promotion
   * @param {string} promotionId promotion id to delete
   * @return ack message response of promotion deleted
   */
  @Delete(':promotionId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of promotion deleted' })
  @Auth(PERMISSIONS.PROMOTION_DELETE)
  async remove(@Param('promotionId') promotionId: string): Promise<CommonResponse> {
    await this.promotionsService.remove(promotionId);
    return { message: 'promotion removed' };
  }
}
