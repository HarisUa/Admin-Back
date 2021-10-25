/**
 * common types used for sb-betting API
 */
export namespace SbCommonTypes {
  /**
   * Response format of sb betting api
   * @export
   * @interface CommonResponse
   * @template T
   */
  export interface CommonResponse<T = any> {
    code: number;
    description: string;
    data: T;
  }

  /**
   * Available register methods
   * @export
   * @enum {number}
   */
  export enum RegisterMethods {
    MOBILE_APP_ANDROID = 'mobile-app-android',
    MOBILE_APP_IOS = 'mobile-app-ios',
    MOBILE_PLATFORM = 'mobile-platform',
    WEB = 'web',
    SSBT = 'SSBT',
  }

  /**
   * Categories data interface from all sb batting APIs
   * @export
   * @interface CategoryDataInterface
   */
  export interface CategoryDataInterface {
    categoryId: number;
    remoteId: number;
    categoryName: string;
    level: number;
    parentCategory: number;
    sportId: number;
    eventsCount: number;
    sortOrder: number;
    treatAsSport: number;
    categoryFlag: string;
    parentName: string;
    sportName: string;
  }

  /**
   * prematch event data interface
   */
  export interface PrematchEventInterface {
    eventId: number;
    remoteId: number;
    eventName: string;
    eventStart: number;
    eventType: number;
    category3Id: number;
    category2Id: number;
    category1Id: number;
    category3Name: string;
    category2Name: string;
    category1Name: string;
    eventCodeId: number;
    gamesCount: number;
    treatAsSport: number;
    participants: [];
    eventGames: EventGame[];
    eventExtendedData?: any;
    result?: string;
  }

  /**
   * event's game
   * @export
   * @interface EventGame
   */
  export interface EventGame {
    gameId: number;
    gameName: string;
    gameType: number;
    gameCode: number;
    argument: number;
    combinationType: number;
    marketTypes: number[];
    periodId: number;
    gameLayout: number;
    eventLayout: number;
    outcomes: Outcome[];
  }

  /**
   * game's outcome
   * @export
   * @interface Outcome
   */
  export interface Outcome {
    outcomeId: number;
    outcomeName: string;
    outcomeOdds: number;
    status: number;
  }
}
