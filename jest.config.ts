import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/tests/setup/env.ts'],
  testTimeout: 30000,
};
export default config;
