import { TASK_COMPILE, TASK_NODE } from 'hardhat/builtin-tasks/task-names';
import { task } from 'hardhat/config';

const goerliWETHAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"

interface VerifyArgs {
  address: string;
  constructorArguments?: (string | number)[];
  libraries?: Record<string, string>;
}

interface Contract {
  args?: (string | number | (() => string | undefined))[];
  address?: string;
  libraries?: () => Record<string, string>;
  waitForConfirmation?: boolean;
}

task(
  'deploy-and-setup',
  'Deploy contracts, verify with etherscan, and populate descriptor, unpause auction house, upgrade to auction house lilVRGDA.',
).setAction(async (_, { ethers, run }) => {
  await run(TASK_COMPILE);

  // Only run for supported network
  const network = await ethers.provider.getNetwork();
  console.log(`chain ID is ${network.chainId}.`);
  if (network.chainId !== 5 && network.chainId !== 31337) {
    console.log(`Invalid chain id. Only Goerli (5) or local hardhat network (31337) allowed.`)
    return;
  }
  if (network.chainId === 31337) {
    await Promise.race([run(TASK_NODE), new Promise(resolve => setTimeout(resolve, 2_000))]);
  }

  // Deploy main contracts
  const contracts: Record<string, Contract> = await run('deploy', {
    weth: goerliWETHAddress,
  });

  // Verify contracts
  const contractsVerification: Record<string, VerifyArgs> = {}
  for (const [name, contract] of Object.entries(contracts)) {
    contractsVerification[name] = {
      address: contract.address!,
      constructorArguments: contract.args?.map(a => (typeof a === 'function' ? a() ?? 'ERROR': a)) ?? [] ,
    }

    if (contract?.libraries?.()) {
      contractsVerification[name].libraries = contract?.libraries?.()
    }
  }
  if (network.chainId === 5) { // Only verify if using Goerli network  
    console.log("contractsVerification", contractsVerification)
    for (const [name, args] of Object.entries(contractsVerification)) {
      console.log(`verifying ${name}...`);
      try {
        await run('verify:verify', {
          ...args,
        });
      } catch (e) {
        console.error(e);
      }
    }
  }

  // Add SVG data to descriptor contract
  await run('populate-descriptor', {
    nftDescriptor: contracts.NFTDescriptor.address,
    nounsDescriptor: contracts.NounsDescriptor.address,
  });

  // Initialize nounsAuctionHouse
  const auctionHouseFactory = await ethers.getContractFactory("contracts/NounsAuctionHouse.sol:NounsAuctionHouse")
  const auctionHouse = auctionHouseFactory.attach(contracts.NounsAuctionHouseProxy.address!)
  await auctionHouse.unpause()

  // Upgrade nounsAuctionHouse
  // TODO - do this via a proposal
  // await run('create-proposal', {
  //   nounsDaoProxy: contracts.NounsDAOProxy.instance.address,
  // });
  const lilVRGDA = await run('upgrade-to-vrgda', {
    auctionHouseProxyAddress: contracts.NounsAuctionHouseProxy.address,
    nounsTokenAddress: contracts.NounsToken.address,
    wethAddress:  goerliWETHAddress
  });

  console.log(contracts)
  console.log(`lilVRGDA.address ${lilVRGDA.address}.`)
  console.log(`Done.`)
});
