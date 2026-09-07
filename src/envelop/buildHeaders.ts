import type { Plugin } from '@envelop/core';
import { v4 as uuid } from 'uuid';
import { ContextType } from '../types';

export const buildHeaders = (): Plugin<ContextType> => {
  return {
    onContextBuilding({ extendContext }) {
      const requestId = uuid();
      extendContext({ requestId: requestId });
    },
  };
};
