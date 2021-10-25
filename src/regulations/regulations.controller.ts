import { Controller, Get, Post, Body, Put, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiCreatedResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { Auth, CommonResponse, INTERNAL_SERVER_ERROR, PERMISSIONS, User } from '@common';

import { RegulationsService } from './regulations.service';
import { CreateRegulationDto } from './dto/create-regulation.dto';
import { UpdateRegulationDto } from './dto/update-regulation.dto';
import { GetRegulationQueryDto } from './dto/get-regulation-query.dto';

/**
 * Controller for v1/regulations routes
 * @export
 * @class RegulationsController
 */
@Controller('v1/regulations')
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('Regulations')
export class RegulationsController {
  /**
   * Creates an instance of RegulationsController.
   * @param {RegulationsService} regulationsService to serve regulation APIs
   */
  constructor(private readonly regulationsService: RegulationsService) {}

  /**
   * To create regulation
   * @param {CreateRegulationDto} createRegulationDto create regulation details
   * @param {string} userId current user id
   * @return created regulation details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'created regulation details' })
  @Auth(PERMISSIONS.REGULATION_CREATE)
  async create(@Body() createRegulationDto: CreateRegulationDto, @User('userId') userId: string): Promise<CommonResponse> {
    const createdRegulation = await this.regulationsService.create(createRegulationDto, userId);
    return { data: { regulation: createdRegulation } };
  }

  /**
   * To get regulation based on filters
   * @param {GetRegulationQueryDto} queryParams filter options
   * @return list of regulations based on filters
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'regulations list' })
  @Auth(PERMISSIONS.REGULATION_INDEX)
  async findAll(@Query() queryParams: GetRegulationQueryDto): Promise<CommonResponse> {
    const { regulations, totalRegulations } = await this.regulationsService.findAll(queryParams);

    return { data: { regulations, total: totalRegulations } };
  }

  /**
   * To get one regulation
   * @param {string} regulationId regulation to fetch
   * @return regulation details
   */
  @Get(':regulationId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'regulation details' })
  @Auth(PERMISSIONS.REGULATION_READ)
  async findOne(@Param('regulationId') regulationId: string): Promise<CommonResponse> {
    const regulation = await this.regulationsService.findOne(regulationId);
    return { data: { regulation } };
  }

  /**
   * To update regulation
   * @param {string} regulationId regulation id
   * @param {UpdateRegulationDto} updateRegulationDto update regulation request
   * @param {string} userId current user id
   * @return updated regulation details
   */
  @Put(':regulationId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'updated regulation details' })
  @Auth(PERMISSIONS.REGULATION_UPDATE)
  async update(
    @Param('regulationId') regulationId: string,
    @Body() updateRegulationDto: UpdateRegulationDto,
    @User('userId') userId: string,
  ): Promise<CommonResponse> {
    const updatedRegulation = await this.regulationsService.update(regulationId, updateRegulationDto, userId);

    return { data: { updatedRegulation } };
  }

  /**
   * To delete regulation
   * @param {string} regulationId regulation id to delete
   * @return ack message response of regulation deleted
   */
  @Delete(':regulationId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'ack of regulation deleted' })
  @Auth(PERMISSIONS.REGULATION_DELETE)
  async remove(@Param('regulationId') regulationId: string): Promise<CommonResponse> {
    await this.regulationsService.remove(regulationId);
    return { message: 'regulation removed' };
  }
}
