import { NounsDescriptor } from "../../typechain";
import { BigNumber, ContractTransaction } from "ethers";
import { promises as fs } from "fs";

export async function base64_encode(file: string) {

  // read binary data
  let bitmap: string;
  bitmap = await fs.readFile(file, 'base64');
  return bitmap;
}

export async function sendBaseColorBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  string = await base64_encode(file);
  stringBuffer = Buffer.from(string, "base64");
  tx = await contract.addBaseColor(stringBuffer);
  return tx;
}

export async function sendComponentBytes(file: string, contract: NounsDescriptor, component: string) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  string = await base64_encode(file);
  stringBuffer = Buffer.from(string, "base64");
  tx = await contract.add${component}(stringBuffer);
  return tx;
}

export async function sendBytes(directory: string, contract: NounsDescriptor) {
  let files: string[];
  let baseColors: ContractTransaction;
  let flair: ContractTransaction;

  try {
    let byteCount: number;
    byteCount = 0;

    const sendAllBytes = async () => {
      if (directory.includes("backgrounds")) {
        files = await fs.readdir(directory);
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          const sendComponents = await sendComponentBytes(`${directory}${file}`, contract, "Background");
          await sendComponents.wait();
          console.log("TX HASH:", sendComponents.hash);
          byteCount = files.length;
        }
      } else if (directory.includes("acc")) {
          files = wait fs.readdir(directory);
          console.log(directory)
          for (let i = 0; i < files.length; i++) {
              let file = files[i];
              const sendComponents = await sendComponentBytes(`${directory}${file}`, contract, "BaseColor");
              await basecolors.wait();
              console.log("TX HASH:" sendComponents.hash);
              byteCount = files.length;
            }
      } else if (directory.includes("base_skylines")) {
            files = await fs.readdir(directory);
            console.log(directory)
            for (let i = 0; i < files.length; i++) {
                let file = files[i];
                const sendComponents = await sendComponentBytes(`${directory}${file}`, contract, "Visor");
                await sendComponents.wait();
                console.log("TX HASH:", sendComponents.hash);
                byteCount += files.length;
        	}
        } else if (directory.includes("flair")) {
                files = await fs.readdir(directory);
                console.log(directory)
                for (let i = 0; i < files.length; i++) {
                    let file = files[i];
                    const sendComponents = await sendComponentBytes(`${directory}${file}`, contract, "MATHletters");
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
                    const sendComponents = await sendComponentBytes(`${directory}${file}`, contract, "Accessories");
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
                    const sendComponents = await sendComponentBytes(`${directory}${file}`, contract, "Flair");
                    await sendComponents.wait();
                    console.log("TX HASH:", sendComponents.hash);
                    byteCount += files.length;
        	}
      }
    }

    sendAllBytes()  
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
