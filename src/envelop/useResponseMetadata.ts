import type { Plugin } from '@envelop/core';
import { handleStreamOrSingleExecutionResult } from '@envelop/core';
import type { ExecutionResult } from 'graphql';
import { ContextType } from '../types';

type ResultWithMetadata = ExecutionResult & {
  metadata?: Record<string, unknown>;
};

/**
 * appended the requestId from the context object to every response
 * as a top-level `metadata` object, alongside `data`:
 */
export const useResponseMetadata = (): Plugin<ContextType> => {
  return {
    onExecute() {
      return {
        onExecuteDone(payload) {
          return handleStreamOrSingleExecutionResult(payload, ({ args, result, setResult }) => {
            const { requestId } = args.contextValue;
            if (!requestId) {
              return;
            }

            const current = result as ResultWithMetadata;
            setResult({
              ...current,
              metadata: { ...current.metadata, requestId },
            } as ExecutionResult);
          });
        },
      };
    },
  };
};
