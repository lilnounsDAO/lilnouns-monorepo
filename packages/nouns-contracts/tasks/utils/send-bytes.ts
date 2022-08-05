import { NounsDescriptor } from "../../typechain";
import { ethers } from "hardhat";
import { BigNumber, ContractTransaction, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
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
  gasEstimate = await contract.estimateGas.addBaseColor(stringBuffer);
  console.log(`Estimated gas to send ${file}: `, gasEstimate);
  tx = await contract.addBaseColor(stringBuffer);
  return tx;
}

export async function sendFlairBytes(file: string, contract: NounsDescriptor) {
  let string: string;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  string = await base64_encode(file);
  stringBuffer = Buffer.from(string, "base64");
  gasEstimate = await contract.estimateGas.addFlair(stringBuffer);
  console.log(`Estimated gas to send ${file}: `, gasEstimate);
  tx = await contract.addFlair(stringBuffer);
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
      if (directory == "../files/Test/backgrounds") {
        files = await fs.readdir(directory);
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          baseColors = await sendBaseColorBytes(`${directory}${file}`, contract);
          await baseColors.wait();
          console.log("TX HASH:", baseColors.hash);
          byteCount = files.length;
        }
      } else if (directory == "../files/Test/pfps") {
        files = await fs.readdir(directory);
        console.log(directory)
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          flair = await sendFlairBytes(`${directory}${file}`, contract);
          await flair.wait();
          console.log("TX HASH:", flair.hash);

          byteCount += files.length;
        }
      } else if (directory == "./local-storage/Test/backgrounds/") {
        files = await fs.readdir(directory);
        console.log(directory)
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          baseColors = await sendBaseColorBytes(`${directory}${file}`, contract);
          await baseColors.wait();
          console.log("TX HASH:", baseColors.hash);
          byteCount += files.length;
        }        
      } else if (directory == "./local-storage/Test/pfps/"){
        files = await fs.readdir(directory);
        console.log(directory)
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          flair = await sendFlairBytes(`${directory}${file}`, contract);
          await flair.wait();
          console.log("TX HASH:", flair.hash);
          byteCount += files.length;

        }        
      }
    };
    sendAllBytes();
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