import { SbCommonTypes } from '../types/sb-common.types';

/**
 * Provide required data for sb basic betting
 */
export namespace SbBasicApi {
  /**
   * Market endpoints
   */
  export namespace Market {
    /**
     * Available game types of give event ids
     */
    export namespace AvailableGameTypes {
      export type EventDataType = Pick<
        SbCommonTypes.PrematchEventInterface,
        'eventId' | 'category1Id' | 'category2Id' | 'category3Id' | 'category1Name' | 'category2Name' | 'category3Name' | 'treatAsSport'
      > & { gameTypes: EventGameTypesInterface[] };

      export interface EventGameTypesInterface {
        gameType: number;
        gameName: string;
        gameLayout: number;
        eventLayout: number;
        marketTypes: number[];
      }

      export type Response = SbCommonTypes.CommonResponse<EventDataType[]>;
    }

    /**
     * to fetch event by id
     */
    export namespace GetEventByEventId {
      export type Response = SbCommonTypes.CommonResponse<SbCommonTypes.PrematchEventInterface>;

      export interface PathParams {
        eventId: string;
      }
    }
  }
}
