import { Injectable } from '@nestjs/common';
import { pick } from 'lodash';

import { CommonHeadersInterface, SB_COMMON_HEADERS_ARRAY } from '@common';
import { SbBasicService } from '@shared/providers';

import { GetEventGameTypesDto } from './dto/get-event-game-types.dto';

/**
 * Provide service for sb-betting controller
 * @export
 * @class SbBettingService
 */
@Injectable()
export class SbBettingService {
  /**
   * Creates an instance of SbBettingService.
   * @param {SbBasicService} sbBasicService to call sb betting basic APIs
   */
  constructor(private readonly sbBasicService: SbBasicService) {}

  /**
   * To get game types of specific event
   * @param {GetEventGameTypesDto} pathParams contains event id
   * @param {CommonHeadersInterface} reqHeaders request headers
   * @return game types dropdown list
   */
  async getGameTypesOfEvent(pathParams: GetEventGameTypesDto, reqHeaders: CommonHeadersInterface) {
    // fetch request language
    const requiredHeaders = pick(reqHeaders, SB_COMMON_HEADERS_ARRAY);

    // fetch event details and game types
    const eventDetailsAndGameTypes = await this.sbBasicService.getAvailableGameTypes([pathParams.eventId], requiredHeaders);

    // construct game types dropdown list
    const gameTypes =
      eventDetailsAndGameTypes[0]?.gameTypes?.map((gameType) => {
        return {
          label: gameType.gameName,
          value: gameType.gameType,
        };
      }) || [];

    return { gameTypes };
  }
}
