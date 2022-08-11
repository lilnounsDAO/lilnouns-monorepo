import { task, types } from 'hardhat/config';
import { NounsToken } from '../typechain';

task('get-noun-image', 'Gets a Noun image')
    .addParam(
        'tokenId', 
        'The token ID of your Noun',
        0,
        types.int,
    )
    .addOptionalParam(
        'nounsToken',
        'The `NounsToken` contract address',
        '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
        types.string,
    )
    .setAction(async ( { tokenId, nounsToken }, { ethers }) => {
        const nftFactory = await ethers.getContractFactory('NounsToken');
        const nftContract = nftFactory.attach(nounsToken) as NounsToken;
        const nounURI = JSON.parse((await nftContract.tokenURI(tokenId)));
        console.log(nounURI.image);
  });