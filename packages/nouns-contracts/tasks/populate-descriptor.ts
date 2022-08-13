import { task, types } from 'hardhat/config';
import { sendBytes } from './utils/send-bytes';
import { NounsDescriptor } from "../typechain/"

task('populate-descriptor', 'Populates the descriptor with MATH Hat parts')
  .addOptionalParam(
    'nftDescriptor',
    'The `NFTDescriptor` contract address',
    '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    types.string,
  )
  .addOptionalParam(
    'nounsDescriptor',
    'The `NounsDescriptor` contract address',
    '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    types.string,
  )
  .setAction(async ({ nounsDescriptor }, { ethers }) => {
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptor');
    const descriptorContract = descriptorFactory.attach(nounsDescriptor) as NounsDescriptor;
    await sendBytes("./files/Test/acc/", descriptorContract);
    await sendBytes("./files/Test/backgrounds/", descriptorContract);
    await sendBytes("./files/Test/base_skylines/", descriptorContract);
    await sendBytes("./files/Test/flair/", descriptorContract);
    await sendBytes("./files/Test/pfps/", descriptorContract);
    await sendBytes("./files/Test/vis/", descriptorContract);
 





    console.log('Descriptor populated with palettes and parts');
  });
