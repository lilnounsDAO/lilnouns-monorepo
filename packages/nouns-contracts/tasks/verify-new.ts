import { task, types } from 'hardhat/config';
import { TEMP_ContractName, DeployedContract } from './types';

// prettier-ignore
// These contracts require a fully qualified name to be passed because
// they share bytecode with the underlying contract.
const nameToFullyQualifiedName: Record<string, string> = {
  NounsAuctionHouseProxy: 'contracts/proxies/NounsAuctionHouseProxy.sol:NounsAuctionHouseProxy',
  NounsAuctionHouseProxyAdmin: 'contracts/proxies/NounsAuctionHouseProxyAdmin.sol:NounsAuctionHouseProxyAdmin',
  NounsDAOLogicV1Harness: 'contracts/test/NounsDAOLogicV1Harness.sol:NounsDAOLogicV1Harness'
};

const new_contracts: Record<string, string> = {
    nounsToken: "0xbd9bd9722FDE1ec321F590993F7f5961F1Bd0d06",
    nounsSeeder: "0xF6a38E8235916334268da317EC84F5dfcfB9e023", //! NOUNS DAO
    nounsDescriptor: "0xB6D0AF8C27930E13005Bf447d54be8235724a102", //! NOUNS DAO
    nftDescriptor: "0x9417e5d955e6e1deA90499Baa527C9d6360b737f", //! NOUNS DAO
    nounsAuctionHouse: "0xe6A9B92c074520de8912EaA4591db1966E2e2B92",
    nounsAuctionHouseProxy: "0x2E10335d2EE34715453936399301B42D2ea8c55c",
    nounsAuctionHouseProxyAdmin: "0x4bEfF263853C4e30d02505A19Cd34F7c9cDFC6BB",
    nounsDaoExecutor: "0xd82c7DC502cbF88cFc5F0821BC514BBA88d70513",
    nounsDAOProxy: "0x4F49457D0Ddd610B451686AeB17dE9562094cD00",
    nounsDAOLogicV1: "0x63DdFBc1cAfC58a957f391a158c98636d9e225E9"
};

task('verify-etherscan', 'Verify the Solidity contracts on Etherscan')
  .addParam('contracts', 'Contract objects from the deployment', undefined, types.json)
  .setAction(async ({ contracts }: { contracts: Record<TEMP_ContractName, DeployedContract> }, hre) => {
    for (const [, contract] of Object.entries(contracts)) {
      console.log(`verifying ${contract.name}...`);
      try {
        const code = await contract.instance?.provider.getCode(contract.address);
        if (code === '0x') {
          console.log(
            `${contract.name} contract deployment has not completed. waiting to verify...`,
          );
          await contract.instance?.deployed();
        }
        await hre.run('verify:verify', {
          ...contract,
          contract: nameToFullyQualifiedName[contract.name],
        });
      } catch ({ message }) {
        if ((message as string).includes('Reason: Already Verified')) {
          continue;
        }
        console.error(message);
      }
    }
  });
