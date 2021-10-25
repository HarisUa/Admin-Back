import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { PlacementsService } from './placements.service';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';
import { GetPlacementQueryDto } from './dto/get-placement-query.dto';
import { ReorderPlacementsBodyDto } from './dto/reorder-placements-body.dto';

/**
 * Controller for v1/placements routes
 * @export
 * @class PlacementsController
 */
@Controller('v1/placements')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Placements')
export class PlacementsController {
  /**
   * Creates an instance of PlacementsController.
   * @param {PlacementsService} placementsService to serve placement APIs
   */
  constructor(private readonly placementsService: PlacementsService) {}

  /**
   * To create placement
   * @param {CreatePlacementDto} createPlacementDto create placement details
   * @param {string} userId current user id
   * @return created placement details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created placement details' })
  @Auth(PERMISSIONS.PLACEMENT_CREATE)
  async create(@Body() createPlacementDto: CreatePlacementDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdPlacement = await this.placementsService.create(createPlacementDto, userId);
    return { data: { placement: createdPlacement } };
  }

  /**
   * To get placements based on filters
   * @param {GetPlacementQueryDto} queryParams filter options
   * @return list of placements based on filters
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'placements list' })
  @Auth(PERMISSIONS.PLACEMENT_INDEX)
  async findAll(@Query() queryParams: GetPlacementQueryDto): Promise<CommonResponse> {
    const { placements, totalPlacements } = await this.placementsService.findAll(queryParams);

    return { data: { placements, total: totalPlacements } };
  }

  /**
   * To find statistics of placements
   * @return placements statistics
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'found placements statistics' })
  @Auth(PERMISSIONS.PLACEMENT_READ)
  async findStatistics(): Promise<CommonResponse> {
    const statistics = await this.placementsService.findStatistics();
    return { data: { ...statistics } };
  }

  /**
   * To get one placement
   * @param {string} placementId placement to fetch
   * @return placement details
   */
  @Get(':placementId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'placement details' })
  @Auth(PERMISSIONS.PLACEMENT_READ)
  async findOne(@Param('placementId') placementId: string): Promise<CommonResponse> {
    const placement = await this.placementsService.findOne(placementId);
    return { data: { placement } };
  }

  /**
   * To reorder specific placement
   * @param {string} placementId placement to update
   * @param {ReorderPlacementsBodyDto} reorderBody update request body
   * @param {string} userId curret user id
   * @return updated placements details
   */
  @Put('reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'reordered placements list and their sort orders' })
  @ApiOperation({ summary: 'to reorder placements' })
  @Auth(PERMISSIONS.PLACEMENT_UPDATE)
  async reorderPlacements(@Body() reorderBody: ReorderPlacementsBodyDto): Promise<CommonResponse> {
    const { placements } = await this.placementsService.reorderPlacements(reorderBody);
    return { data: { placements } };
  }

  /**
   * To update placement
   * @param {string} placementId placement id
   * @param {UpdatePlacementDto} updatePlacementDto update placement request
   * @param {string} userId current user id
   * @return updated placement details
   */
  @Put(':placementId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated placement details' })
  @Auth(PERMISSIONS.PLACEMENT_UPDATE)
  async update(
    @Param('placementId') placementId: string,
    @Body() updatePlacementDto: UpdatePlacementDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const updatedPlacement = await this.placementsService.update(placementId, updatePlacementDto, userId);

    return { data: { placement: updatedPlacement } };
  }

  /**
   * To delete placement
   * @param {string} placementId placement id to delete
   * @return ack message response of placement deleted
   */
  @Delete(':placementId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of placement deleted' })
  @Auth(PERMISSIONS.PLACEMENT_DELETE)
  async remove(@Param('placementId') placementId: string): Promise<CommonResponse> {
    await this.placementsService.remove(placementId);
    return { message: 'placement removed' };
  }
}
