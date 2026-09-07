import { getMeshSDK } from '../../../.mesh';
import { mapNeoFeed, NearEarthObjectFeed } from './mapNeoFeed';

const sdk = getMeshSDK();

export const resolvers = {
  Query: {
    nearEarthObjects: async (
      _parent: unknown,
      args: { startDate: string; endDate: string }
    ): Promise<NearEarthObjectFeed> => {
      const { neoFeed } = await sdk.neoFeed_query({
        startDate: args.startDate,
        endDate: args.endDate,
      });
      return mapNeoFeed(neoFeed);
    },
  },
};
