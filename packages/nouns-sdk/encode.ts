import { PNGCollectionEncoder } from '@nouns/sdk';
import { readPngFile } from 'node-libpng';
import { promises as fs } from 'fs';
import * as path from 'path';

const DESTINATION = path.join(__dirname, './output/image-data.json');

const encode = async () => {
  const encoder = new PNGCollectionEncoder();

  const folders = ['accessories'];
  for (const folder of folders) {
    const folderpath = path.join(__dirname, './test/lib/images/', folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      console.log(file);
      const image = await readPngFile(path.join(folderpath, file));
      encoder.encodeImage(file.replace(/\.png$/, ''), image, folder);
    }
  }
  await encoder.writeToFile(DESTINATION);

}

encode();
