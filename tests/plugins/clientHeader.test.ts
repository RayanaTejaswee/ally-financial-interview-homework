import { parse } from 'graphql';
import { makeExecutor } from '../exectuor';
import { resetAddresses } from '../setup/env';

const QUERY = parse(`query { address(username: "jack") { city } }`);

const MUTATION = parse(`
  mutation {
    createAddress(
      username: "zoe"
      address: { street: "1 A St", city: "B", state: "OR", zipcode: "97001" }
    ) { street }
  }
`);

describe('required "client" header (Ticket 3)', () => {
  beforeEach(() => resetAddresses());

  test('rejects a request with no client header', async () => {
    const result: any = await makeExecutor({})({ document: QUERY });

    expect(result.errors?.[0].message).toBe('Missing required "client" header');
  });

  test('client "strata" may run queries', async () => {
    const result: any = await makeExecutor({ client: 'strata' })({ document: QUERY });

    expect(result.errors).toBeUndefined();
    expect(result.data.address.city).toBe('Sometown');
  });

  test('client "strata" may not run mutations', async () => {
    const result: any = await makeExecutor({ client: 'strata' })({ document: MUTATION });

    expect(result.errors?.[0].message).toBe(
      'Client "strata" is not permitted to perform mutations'
    );
  });

  test('an ordinary client may run mutations', async () => {
    const result: any = await makeExecutor({ client: 'test' })({ document: MUTATION });

    expect(result.errors).toBeUndefined();
    expect(result.data.createAddress.street).toBe('1 A St');
  });
});
