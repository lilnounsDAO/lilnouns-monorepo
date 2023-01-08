import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case config.bigNounsAddresses.nounsDAOProxy.toLowerCase():
      return 'Nouns DAO Proxy';
    case config.bigNounsAddresses.nounsAuctionHouseProxy.toLowerCase():
      return 'Nouns Auction House Proxy';
    case config.bigNounsAddresses.nounsDaoExecutor.toLowerCase():
      return 'Nouns DAO Treasury';
      
    case config.addresses.nounsDAOProxy.toLowerCase():
      return 'Lil Nouns DAO Proxy';
    case config.addresses.nounsAuctionHouseProxy.toLowerCase():
      return 'Lil Nouns Auction House Proxy';
    case config.addresses.nounsDaoExecutor.toLowerCase():
      return 'Lil Nouns DAO Treasury';
    default:
      return undefined;
  }
};
