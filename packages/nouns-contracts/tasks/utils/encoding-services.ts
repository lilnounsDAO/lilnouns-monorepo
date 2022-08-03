import { toUtf8Bytes } from 'ethers/lib/utils';
import { promises as fs } from 'fs';
import { inputFile } from 'hardhat/internal/core/params/argumentTypes';
import path from 'path';

export async function base64_encode(file: string) {

    // read binary data
    let bitmap: string;
    bitmap = await fs.readFile(file, 'base64');
    return bitmap;
}


async function base64EncodeEntireDirectory(directory: string) {
    
    let folderpath: string;
    let files: string[];
    let base64: string;
    let image: string;
    let folder: string;
    let file: string;
    let folders: string[];
    let storeStrings: string[];

    // initialize array of straings
    storeStrings = []; 

    // declare folders 
    // @dev - maybe make this more dynamic in the future
    if (directory == "./png-layers/free-hats/") {
        folders = [
            'flair',
            'hats'
        ]
    } else {
    folders = [
        'Background', 
        'BaseColor', 
        'VisorColor', 
        'Letters', 
        'Accessories',
        'Flair'];
    }
    
    // loop through folders
      for (folder of folders) {     
        folderpath = path.join(__dirname, directory, folder);

        // Loop through files within a given folder
        files = await fs.readdir(folderpath);
            for (file of files) {

                // base64 encode the file
                image = path.join(folderpath, file);
                base64 = await base64_encode(image);
                storeStrings.push(base64);
                /*
                    @dev -
                    Positions 0 - 6 are backgrounds
                    Positions 7 - 17 are base colors
                    Positions 18 - 38 are visor colors
                    Positions 39 - 54 are letters
                    Positions 55 - 86 are accessories
                    Positions 87 - 112 are flair
                */ 
            }
        }
        return storeStrings;
    }

export async function base64EncodeFolder(directory: string) {
    let storeStrings: string[];
    let files: string[];
    let file: string;
    let base64: string;
    let image: string;

    // initialize array of strings
    storeStrings = [];

    // loop through files in given directory
    files = await fs.readdir(directory);
    for (file of files) {
        // base64 encode given file
        image = path.join(directory, file);
        base64 = await base64_encode(image);
        storeStrings.push(base64);
    }
    return storeStrings;
}

export async function utf8EncodeDirectory(directory: string) {
    let strings: string[];
    let encodedImages: Uint8Array[];

    // Encode whole directory to base64
    strings = await base64EncodeEntireDirectory(directory);
    encodedImages = [];

    // Loop through base64 strings and encode in utf16
    for (const string in strings) {
        const byteEncodeImage = toUtf8Bytes(string);
        encodedImages.push(byteEncodeImage);
    }
    return encodedImages;
}

export async function byteEncodeFolder(folderPath: string) {
    let strings: string[];
    let encodedImages: Buffer[];

    // Encode whole directory to base64
    strings = await base64EncodeFolder(folderPath);
    encodedImages = [];

    // Loop through base64 strings and encode in utf8
    for (let i = 0; i < strings.length; i++) {
        let string = strings[i];
        const stringBuffer = (Buffer.from(string, 'base64'));
        encodedImages.push(stringBuffer);
    }
    return(encodedImages);

}