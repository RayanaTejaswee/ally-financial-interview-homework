import { Address, Args, CreateAddressArgs } from './types';
import { GraphQLError } from 'graphql';
import { getAddressRecord, saveAddress, AddressExistsError } from './addressStore';

const _getAddress = (username: string): Address | null => {
  return getAddressRecord(username);
};

export const getAddress = (_: any, args: Args, context: any): Address => {
  context.logger.info('getAddress', 'Enter resolver');
  const address = _getAddress(args.username);
  if (address) {
    context.logger.info('getAddress', 'Returning address');
    return address;
  }
  context.logger.error('getAddress', 'No address found');
  throw new GraphQLError('No address found in getAddress resolver');
};

export const createAddress = (_: any, args: CreateAddressArgs, context: any): Address => {
  context.logger.info('createAddress', 'Enter resolver');
  try {
    const created = saveAddress(args.username, args.address);
    context.logger.info('createAddress', 'Address created');
    return created;
  } catch (err) {
    if (err instanceof AddressExistsError) {
      context.logger.error('createAddress', 'Address already exists');
      throw new GraphQLError('An address already exists for that user');
    }
    context.logger.error('createAddress', 'Failed to create address');
    throw new GraphQLError('Unable to create address in createAddress resolver');
  }
};
