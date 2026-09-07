import { parse } from 'graphql';
import { executor } from '../exectuor';
import { resetAddresses, readAddressesFile, SEED_ADDRESSES } from '../setup/env';

const CREATE = parse(`
  mutation CreateAddress($username: String!, $address: AddressInput!) {
    createAddress(username: $username, address: $address) {
      street
      city
      state
      zipcode
    }
  }
`);

const address = {
  street: '9 Elm St',
  city: 'Newtown',
  state: 'WA',
  zipcode: '98101',
};

describe('createAddress mutation (Ticket 2)', () => {
  beforeEach(() => resetAddresses());

  test('creates a new record, persists it, and returns it with the state field', async () => {
    const result: any = await executor({
      document: CREATE,
      variables: { username: 'nora', address },
    });

    expect(result.errors).toBeUndefined();
    expect(result.data.createAddress).toEqual(address);
    expect(readAddressesFile().nora).toEqual(address);
  });

  test('does not overwrite existing records', async () => {
    await executor({ document: CREATE, variables: { username: 'nora', address } });

    const onDisk = readAddressesFile();
    expect(onDisk.jack).toEqual(SEED_ADDRESSES.jack);
    expect(onDisk.jill).toEqual(SEED_ADDRESSES.jill);
  });

  test('rejects a create for a username that already exists', async () => {
    const result: any = await executor({
      document: CREATE,
      variables: { username: 'jack', address },
    });

    expect(result.errors?.[0].message).toBe('An address already exists for that user');
    expect(readAddressesFile().jack).toEqual(SEED_ADDRESSES.jack);
  });
});
