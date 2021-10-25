import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CommonHeadersInterface, CommonResponse, CustomApiCommonHeaders, INTERNAL_SERVER_ERROR, SB_COMMON_HEADERS } from '@common';

import { SbBettingService } from './sb-betting.service';
import { GetEventGameTypesDto } from './dto/get-event-game-types.dto';

/**
 * Controller for v1/sb-betting routes
 * @export
 * @class SbBettingController
 */
@Controller('v1/sb-betting')
@CustomApiCommonHeaders(SB_COMMON_HEADERS.REQUEST_LANGUAGE)
@ApiInternalServerErrorResponse({ description: INTERNAL_SERVER_ERROR })
@ApiTags('SB-BETTING')
export class SbBettingController {
  /**
   * Creates an instance of SbBettingController.
   * @param {SbBettingService} sbBettingService to serve sb betting APIs
   */
  constructor(private readonly sbBettingService: SbBettingService) {}

  /**
   * To give game types of given event id
   * @param {GetEventGameTypesDto} pathParams contains event id to query
   * @param {CommonHeadersInterface} reqHeaders request headers
   * @return {Promise<CommonResponse>} game types dropdown list
   */
  @Get('events/:eventId/game-types')
  @ApiOkResponse({ description: 'give game types of given event id' })
  @ApiOperation({ summary: 'to get game types of specific event' })
  async getGameTypesOfEvent(@Param() pathParams: GetEventGameTypesDto, @Headers() reqHeaders: CommonHeadersInterface): Promise<CommonResponse> {
    const { gameTypes } = await this.sbBettingService.getGameTypesOfEvent(pathParams, reqHeaders);

    return { data: { gameTypes } };
  }
}

