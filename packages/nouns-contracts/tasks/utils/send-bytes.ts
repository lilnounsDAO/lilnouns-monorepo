import { NounsDescriptor } from "../../typechain";
import { BigNumber, ContractTransaction } from "ethers";
import { promises as fs } from "fs";

export async function base64_encode(file: string) {

  // read binary data
  let bitmap: string;
  bitmap = await fs.readFile(file, 'base64');
  return bitmap;
}

export async function sendBackgroundBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  string = await base64_encode(file);
  stringBuffer = Buffer.from(file);
  tx = await contract.addBackground(stringBuffer);
  const count = await contract.backgroundCount();
  console.log("Background count:", count);
  return tx;
}


export async function sendBaseColorBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  // string = await base64_encode(file);
  stringBuffer = Buffer.from(file);
  tx = await contract.addBaseColor(stringBuffer);
  const count = await contract.baseColorCount();
  console.log("Base Color count:", count);
  return tx;
}

export async function sendVisorBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

 // string = await base64_encode(file);
  stringBuffer = Buffer.from(file);
  tx = await contract.addVisor(stringBuffer);
  const count = await contract.visorCount();
  console.log("Visor count:", count);
  return tx;
}

export async function sendMATHLettersBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  // string = await base64_encode(file);
  stringBuffer = Buffer.from(file);
  tx = await contract.addMATHletters(stringBuffer);
   const count = await contract.mathlettersCount();
  console.log("MATH Letters count:", count);
  return tx;
}


export async function sendAccessoryBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

 // string = await base64_encode(file);
  stringBuffer = Buffer.from(file);
  tx = await contract.addAccessory(stringBuffer);
   const count = await contract.accessoriesCount();
  console.log("Accessory count:", count);
  return tx;
}


export async function sendFlairBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

//  string = await base64_encode(file);
  stringBuffer = Buffer.from(file);
  tx = await contract.addFlair(stringBuffer);
  const count = await contract.flairCount();
  console.log("Flair count:", count);
  return tx;
}

export async function sendBytes(directory: string, contract: NounsDescriptor) {
  let files: string[];

  try {
    let byteCount: number;
    byteCount = 0;

    const sendAllBytes = async () => {
      if (directory.includes("backgrounds")) {
        files = await fs.readdir(directory);
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          const sendComponents = await sendBackgroundBytes(`${directory}${file}`, contract);
          await sendComponents.wait();
          console.log("TX HASH:", sendComponents.hash);
          byteCount = files.length;
        }
      } else if (directory.includes("acc")) {
          files = await fs.readdir(directory);
          console.log(directory)
          for (let i = 0; i < files.length; i++) {
              let file = files[i];
              const sendComponents = await sendBaseColorBytes(`${directory}${file}`, contract);
              await sendComponents.wait();
              console.log("TX HASH:", sendComponents.hash);
              byteCount = files.length;
            }
      } else if (directory.includes("base_skylines")) {
            files = await fs.readdir(directory);
            console.log(directory)
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                const sendComponents = await sendVisorBytes(`${directory}${file}`, contract);
                await sendComponents.wait();
                console.log("TX HASH:", sendComponents.hash);
                byteCount += files.length;
        	}
        } else if (directory.includes("flair")) {
                files = await fs.readdir(directory);
                console.log(directory)
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    const sendComponents = await sendMATHLettersBytes(`${directory}${file}`, contract);
                    await sendComponents.wait();
                    console.log("TX HASH:", sendComponents.hash);
                    byteCount += files.length;
        	}
      }
            else if (directory.includes("pfps")) {
                files = await fs.readdir(directory);
                console.log(directory)
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    const sendComponents = await sendAccessoryBytes(`${directory}${file}`, contract);
                    await sendComponents.wait();
                    console.log("TX HASH:", sendComponents.hash);
                    byteCount += files.length;
        	}
      }
            else if (directory.includes("vis")) {
                files = await fs.readdir(directory);
                console.log(directory)
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    const sendComponents = await sendFlairBytes(`${directory}${file}`, contract);
                    await sendComponents.wait();
                    console.log("TX HASH:", sendComponents.hash);
                    byteCount += files.length;
        	}
      }
    }

    await sendAllBytes()  
    await contract.addArtStyle("Solar");
    return byteCount;
  } catch (e) {
    console.error(e);
  }
}

// async function fullSend() {
// await sendBytes("../files/Test/backgrounds");
// await sendBytes("../files/Test/pfps");
// }

// fullSend();
// sendBytes("./local-storage/Test/backgrounds/");
// sendBytes("./local-storage/Test/pfps/");
