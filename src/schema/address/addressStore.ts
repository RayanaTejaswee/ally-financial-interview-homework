import fs from 'fs';
import path from 'path';
import { Addresses, Address } from './types';


const ADDRESSES_PATH =
  process.env.ADDRESSES_PATH ?? path.join(__dirname, '../../../data/addresses.json');

/** Thrown by `saveAddress` when a record already exists for the username. */
export class AddressExistsError extends Error {
  constructor(public readonly username: string) {
    super(`Address already exists for user "${username}"`);
    this.name = 'AddressExistsError';
  }
}

export const readAddresses = (): Addresses => {
  const raw = fs.readFileSync(ADDRESSES_PATH, 'utf-8');
  return JSON.parse(raw) as Addresses;
};

export const getAddressRecord = (username: string): Address | null => {
  return readAddresses()[username] ?? null;
};


export const saveAddress = (username: string, address: Address): Address => {
  const addresses = readAddresses();
  if (addresses[username]) {
    throw new AddressExistsError(username);
  }
  addresses[username] = address;
  fs.writeFileSync(ADDRESSES_PATH, JSON.stringify(addresses, null, 2) + '\n');
  return address;
};
