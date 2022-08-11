import { task, types } from 'hardhat/config';
import { NounsAuctionHouse, NounsAuctionHouseProxy } from '../typechain';

task('unpause-auctions', 'Unpauses the auctions')
    .addOptionalParam(
        'auctionHouse',
        'Address of auctionhouse',
        // '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9',
        '0x0165878A594ca255338adfa4d48449f69242Eb8F',
        types.string
    )
    .setAction(async ( { auctionHouse }, { ethers }) => {
        const auctionFactory = await ethers.getContractFactory('NounsAuctionHouseProxy');
        const auctionHouseContract = auctionFactory.attach(auctionHouse) as NounsAuctionHouse;
        const createBid = await auctionHouseContract.createBid(0, {
            value: ethers.utils.parseEther(".01")
        })
        const response = await createBid.wait();
        console.log(response.events?.[1]);
  });