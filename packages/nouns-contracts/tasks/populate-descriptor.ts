import { task, types } from 'hardhat/config';
import ImageData from '../files/image-data.json';
import { chunkArray } from '../utils';
import { NounsDescriptor } from "../typechain/"

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
    const descriptorContract = descriptorFactory.attach(nounsDescriptor) as NounsDescriptor;

    const { artstyles, palette, images } = ImageData;
    const { Backgrounds, BaseColors, VisorColors, Letters, Accessories, Flair } = images;

    // Chunk head and accessory population due to high gas usage
    await descriptorContract.addArtStyle(artstyles[0]);

    const palletChunk = chunkArray(palette, 10);
    for (const chunk of palletChunk) {
      await descriptorContract.addManyColorsToPalette(0, palette)
    }
    await descriptorContract.addManyColorsToPalette(0, palette);


    const backgroundChunk = chunkArray(Backgrounds, 10);
    for (const chunk of backgroundChunk) {
      await descriptorContract.addManyBackgrounds(chunk.map(({ data }) => data));
    }
    const baseColorChunk = chunkArray(BaseColors, 10);
    for (const chunk of baseColorChunk) {
      await descriptorContract.addManyBaseColors(chunk.map(({ data }) => data));
    }

    const visorChunk = chunkArray(VisorColors, 10);
    for (const chunk of visorChunk) {
      await descriptorContract.addManyVisorColors(chunk.map(({ data }) => data));
    }

    const lettersChunk = chunkArray(Letters, 10);
    for (const chunk of lettersChunk) {
      await descriptorContract.addManyMATHletters(chunk.map(({ data }) => data));
    }

    const accessoryChunk = chunkArray(Accessories, 10);
    for (const chunk of accessoryChunk) {
      await descriptorContract.addManyAccessories(chunk.map(({ data }) => data));
    }

    const flairChunk = chunkArray(Flair, 10);
    for (const chunk of flairChunk) {
      await descriptorContract.addManyFlair(chunk.map(({ data }) => data));
    }
    await descriptorContract.addManyLetters(Letters.map(({ data }) => data));

    console.log('Descriptor populated with palettes and parts');
  });
