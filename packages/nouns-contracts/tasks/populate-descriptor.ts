import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { chunkArray } from '../utils';

task('populate-descriptor', 'Populates the descriptor with color palettes and Noun parts')
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
  .setAction(async ({ nftDescriptor, nounsDescriptor }, { ethers }) => {
    const descriptorFactory = await ethers.getContractFactory('NounsDescriptor', {
      libraries: {
        NFTDescriptor: nftDescriptor,
      },
    });
    const descriptorContract = descriptorFactory.attach(nounsDescriptor);

    const { artstyle, palette, images } = ImageData;
    const { Backgrounds, BaseColors, VisorColors, Letters, Accessories, Flair } = images;

    // Chunk head and accessory population due to high gas usage
    await descriptorContract.addArtstyle(artstyle);
    await descriptorContract.addManyColorsToPalette(0, palette);
    await descriptorContract.addManyBackgrounds(Backgrounds.map(({ data }) => data));

    const accessoryChunk = chunkArray(BaseColors, 10);
    for (const chunk of accessoryChunk) {
      await descriptorContract.addManyBaseColors(chunk.map(({ data }) => data));
    }

    const headChunk = chunkArray(VisorColors, 10);
    for (const chunk of headChunk) {
      await descriptorContract.addManyVisorColors(chunk.map(({ data }) => data));
    }

    await descriptorContract.addManyLetters(Letters.map(({ data }) => data));

    console.log('Descriptor populated with palettes and parts');
  });
