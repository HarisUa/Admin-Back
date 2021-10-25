import { tagTemplate } from '@common';

import { SbBasicApi } from './sb-basic-api.types';

const marketEndpoint = 'market';

export const SbBasicEndpoints = {
  market: {
    base: marketEndpoint,

    // to fetch available game types of given events
    availableGameTypes: `${marketEndpoint}/events/multi/markets`,

    // to fetch event by id
    getEventByEventId: tagTemplate<SbBasicApi.Market.GetEventByEventId.PathParams>`${marketEndpoint}/events/${'eventId'}`,
  },
};
