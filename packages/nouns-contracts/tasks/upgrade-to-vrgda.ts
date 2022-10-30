import { task, types } from 'hardhat/config';

task('upgrade-to-vrgda', 'Deploys NFTDescriptor, NounsDescriptor, NounsSeeder, and NounsToken')
  .addParam(
    'auctionHouseProxyAddress',
    'The `NounsAuctionHouseProxy` contract address',
  )
  .addParam(
    'nounsTokenAddress',
    'The `NounsToken` contract address',
  )
  .addParam(
    'wethAddress',
    'The `NounsToken` contract address',
  )
  .setAction(async ({auctionHouseProxyAddress, nounsTokenAddress, wethAddress}, { ethers, upgrades, run }) => {
    console.log(`auctionHouseProxyAddress ${auctionHouseProxyAddress}.`)
    console.log(`nounsTokenAddress ${nounsTokenAddress}.`)
    console.log(`wethAddress ${wethAddress}.`)
    const network = await ethers.provider.getNetwork()
    console.log(`network chain ID is ${network.chainId}.`)
    const auctionHouseFactory = await ethers.getContractFactory("contracts/NounsAuctionHouse.sol:NounsAuctionHouse")
    const auctionHouseProxy = auctionHouseFactory.attach(auctionHouseProxyAddress)

    const { nounId } = await auctionHouseProxy.auction()
    console.log(`nounId from auctionHouseProxy is ${nounId}.`)

    const nounsTokenFactory = await ethers.getContractFactory("contracts/NounsToken.sol:NounsToken")
    const nounsToken = nounsTokenFactory.attach(nounsTokenAddress)
    const lilVRGDAFactory = await ethers.getContractFactory("contracts/LilVRGDA.sol:LilVRGDA")
    const args = [
        ethers.utils.parseEther("0.15"), // Target price.
        0.31e18.toString(), // Price decay percent.
        (24 * 4 * 1e18).toString(), // Per time unit.
        nounId, // ID of the noun last sold
        1667841287, // block.timestamp, // auction start time // TODO
        nounsTokenAddress, // _nounsTokenAddress,
        wethAddress,// _wethAddress,
        0 // reservePrice
    ];
    // const lilVRGDA = await lilVRGDAFactory.deploy(...args);
    // console.log(`lilVRGDA deployed to ${lilVRGDA.address}.`)
    if (network.chainId === 5) {
      console.log(`Verifying LilVRGDA on GOERLI...`);
      try {
        await run('verify:verify', {
          // address: lilVRGDA.address,
          address: "0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44",
          constructorArguments: [...args]
        });
      } catch (e) {
        console.error(e);
      }
    }

    // TODO Update the owner of the LilVRGDA contract to the nounsDAOExecutor
    // lilVRGDA.transferOwnership(auctionHouse.owner());
   
    // Update the minter on the nounsToken from the previous auction
    // house to the lilVRGDA contract
    // await nounsToken.setMinter(lilVRGDA.address)
    await nounsToken.setMinter("0x9A283c74A05Cdb60482B6EFf7a7CCCb301fD8B44")
    console.log("nounsToken minter updated to lilVRGDA address.")
    // return lilVRGDA;
  }
)
