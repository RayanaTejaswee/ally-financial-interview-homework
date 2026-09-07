import type { Plugin } from '@envelop/core';
import { GraphQLError, getOperationAST } from 'graphql';
import { ContextType } from '../types';

const REQUIRED_HEADER = 'client';
const RESTRICTED_CLIENT = 'strata';

export const useClientHeader = (): Plugin<ContextType> => {
  return {
    onContextBuilding({ context, extendContext }) {
      const request = (context as { request?: Request } | null)?.request;
      const client = request?.headers.get(REQUIRED_HEADER)?.trim();

      if (!client) {
        throw new GraphQLError(`Missing required "${REQUIRED_HEADER}" header`, {
          extensions: { code: 'CLIENT_HEADER_REQUIRED', http: { status: 400 } },
        });
      }

      extendContext({ client });
    },

    onExecute({ args, setResultAndStopExecution }) {
      if (args.contextValue.client !== RESTRICTED_CLIENT) {
        return;
      }

      const operation = getOperationAST(args.document, args.operationName);
      if (operation?.operation === 'mutation') {
        setResultAndStopExecution({
          data: null,
          errors: [
            new GraphQLError(
              `Client "${RESTRICTED_CLIENT}" is not permitted to perform mutations`,
              { extensions: { code: 'CLIENT_MUTATION_FORBIDDEN', http: { status: 403 } } }
            ),
          ],
        });
      }
    },
  };
};
