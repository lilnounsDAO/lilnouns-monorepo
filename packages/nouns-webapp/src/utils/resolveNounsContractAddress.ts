import config from '../config';

export const resolveNounContractAddress = (address: string) => {
  switch (address.toLowerCase()) {
    case "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d".toLowerCase():
      return 'Nouns DAO Proxy';
    case "0x830BD73E4184ceF73443C15111a1DF14e495C706".toLowerCase():
      return 'Nouns Auction House Proxy';
    case "0x0BC3807Ec262cB779b38D65b38158acC3bfedE10".toLowerCase():
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
