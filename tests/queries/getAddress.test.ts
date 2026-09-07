import { parse } from 'graphql';
import { executor } from '../exectuor';
import { resetAddresses } from '../setup/env';

describe('getAddress', () => {
  beforeEach(() => resetAddresses());

  test('Success', async () => {
    const query = `
            query GetAddress($username: String!) {
                address(username: $username) {
                    street
                    city
                    state
                    zipcode
                }
            }
        `;

    const variables = { username: 'jack' };

    const result = await executor({
      document: parse(query),
      variables,
    });

    expect(result).toEqual({
      "data": {
        "address": {
          street: '123 Street St.',
          city: 'Sometown',
          state: 'CA',
          zipcode: '43215',
        }
      },
      "metadata": {
        requestId: expect.any(String),
      }
    });
  });

  test('Error', async () => {
    const query = `
            query GetAddress($username: String!) {
                address(username: $username) {
                    street
                    city
                    state
                    zipcode
                }
            }
        `;

    const variables = { username: 'john' };

    const result = await executor({
      document: parse(query),
      variables,
    });

    expect(result).toEqual(
    expect.objectContaining(
      {
        "errors": expect.arrayContaining([expect.objectContaining({
          "message": "No address found in getAddress resolver"
        })]),
        "metadata": { requestId: expect.any(String) }
      }
    )
    );
  });
});
