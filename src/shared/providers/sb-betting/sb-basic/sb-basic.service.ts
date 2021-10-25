import { HttpStatus, Injectable } from '@nestjs/common';
import got, { Got, HandlerFunction, Response } from 'got';

import { CommonHeadersInterface } from '@common';
import { SB_BETTING_CONFIG } from '@shared/config';
import { SbBettingException } from '@shared/exceptions';

import { SbBasicEndpoints } from './api-basic-endpoints';
import { SbBasicApi } from './sb-basic-api.types';

/**
 * Provide service to fetch data from sb betting basic APIs
 * @export
 * @class SbBasicService
 */
@Injectable()
export class SbBasicService {
  /**
   * Got client to call sb betting APIs
   * @private
   * @type {Got}
   */
  private readonly apiClient: Got;

  /**
   * To handle incoming request/response from sb-betting api
   * @private
   * @type {HandlerFunction}
   */
  private apiHandler: HandlerFunction = (options, next) => {
    if (options.isStream) {
      return next(options);
    }
    return (async () => {
      // ! Remove type casting after GOT fix type issue
      const response: Response<any> = (await next(options)) as any;
      const body = response.body;
      const headers = response.headers;

      // throw custom exception only if status code is not error code and error code found in response body
      if (body?.code >= HttpStatus.BAD_REQUEST && response.statusCode < HttpStatus.BAD_REQUEST) {
        throw new SbBettingException(body, headers);
      }
      return response as any;
    })();
  };

  /**
   * Creates an instance of SbBettingService.
   */
  constructor() {
    this.apiClient = got.extend({
      prefixUrl: SB_BETTING_CONFIG.basicApi,
      responseType: 'json',
      handlers: [this.apiHandler],
    });
  }

  /**
   * To give available game types of events
   * @param {string[]} eventIds event ids to search
   * @param {CommonHeadersInterface} headers header to send
   * @return event details and its game types
   */
  async getAvailableGameTypes(eventIds: string[], headers: CommonHeadersInterface) {
    const response = await this.apiClient.post<SbBasicApi.Market.AvailableGameTypes.Response>(`${SbBasicEndpoints.market.availableGameTypes}`, {
      headers,
      json: eventIds,
    });
    return response.body.data;
  }

  /**
   * To get event by event id
   * @param {SbBasicApi.Market.GetEventByEventId.PathParams} pathParams required path parameters
   * @param {CommonHeadersInterface} headers headers to send
   * @return events details res
   */
  async getEventByEventId(pathParams: SbBasicApi.Market.GetEventByEventId.PathParams, headers: CommonHeadersInterface) {
    const apiEndpoint = SbBasicEndpoints.market.getEventByEventId(pathParams);

    const eventsByEventIdRes = await this.apiClient.get<SbBasicApi.Market.GetEventByEventId.Response>(apiEndpoint, {
      headers,
    });
    return eventsByEventIdRes.body.data;
  }
}
