import fs from 'fs';
import os from 'os';
import path from 'path';


export const TEST_ADDRESSES = {
  jack: { street: '123 Street St.', city: 'Sometown', state: 'CA', zipcode: '43215' },
  jill: { street: '234 Other St', city: 'Townville', state: 'NY', zipcode: '32145' },
};

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ally-addresses-'));
const file = path.join(dir, 'addresses.json');

fs.writeFileSync(file, JSON.stringify(TEST_ADDRESSES, null, 2) + '\n');
process.env.ADDRESSES_PATH = file;

/** Restore the temp file to its seed state. Call from `beforeEach`. */
export const resetAddresses = () => {
  fs.writeFileSync(
    process.env.ADDRESSES_PATH as string,
    JSON.stringify(TEST_ADDRESSES, null, 2) + '\n'
  );
};

/** Read the temp file back as an object. */
export const readAddressesFile = () =>
  JSON.parse(fs.readFileSync(process.env.ADDRESSES_PATH as string, 'utf-8'));
