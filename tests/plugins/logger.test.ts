import { parse } from 'graphql';
import winston from 'winston';
import { executor } from '../exectuor';
import { resetAddresses } from '../setup/env';

type LogInfo = Record<string, unknown>;

const captured: LogInfo[] = [];
let logSpy: jest.SpyInstance;

beforeEach(() => {
  resetAddresses();
  captured.length = 0;
  logSpy = jest
    .spyOn(winston.transports.Console.prototype, 'log')
    .mockImplementation((...args: unknown[]) => {
      const [info, next] = args as [LogInfo, (() => void) | undefined];
      captured.push(info);
      next?.();
    });
});

afterEach(() => logSpy.mockRestore());

const runQuery = () =>
  executor({ document: parse(`query { address(username: "jack") { city } }`) });

describe('request logging', () => {
  test('every log line carries the generated requestId (Ticket 4)', async () => {
    await runQuery();

    expect(captured.length).toBeGreaterThan(0);
    for (const line of captured) {
      expect(typeof line.requestId).toBe('string');
      expect(line.requestId).not.toBe('');
    }
  });

  test('every log line carries the client header (Ticket 5)', async () => {
    await runQuery();

    expect(captured.length).toBeGreaterThan(0);
    for (const line of captured) {
      expect(line.client).toBe('test');
    }
  });
});
