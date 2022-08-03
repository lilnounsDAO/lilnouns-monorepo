import { base64_encode } from "../../services";
import { FreeMagicalMathHats, FreeMagicalMathHats__factory } from "../../typechain-types";
import { ethers } from "hardhat";
import { BigNumber, ContractTransaction, Signer } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { promises as fs } from "fs";


async function init() {
  let signers: SignerWithAddress[];
  let deployer: Signer;
  let freehatscontract: FreeMagicalMathHats;
  
  const mumbaiProvider = new ethers.providers.AlchemyProvider(80001, `${process.env.MUMBAI_ALCHEMY_KEY}`);
  const mumbaiWallet = new ethers.Wallet(`${process.env.MUMBAI_PRIVKEY}`, mumbaiProvider);

  signers = await ethers.getSigners();
  deployer = signers[0];

  freehatscontract = (await ethers.getContractAt(
    FreeMagicalMathHats__factory.abi,
    `${process.env.FREEHATS_ADDR}`,
    deployer
  )) as FreeMagicalMathHats;
  return freehatscontract;
}


export async function sendBaseColorBytes(file: string) {
  let string: string;
  let freehatscontract: FreeMagicalMathHats;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  freehatscontract = await init();
  string = await base64_encode(file);
  stringBuffer = Buffer.from(string, "base64");
  gasEstimate = await freehatscontract.estimateGas.addBaseColor(stringBuffer);
  console.log(`Estimated gas to send ${file}: `, gasEstimate);
  tx = await freehatscontract.addBaseColor(stringBuffer);
  return tx;
}

export async function sendFlairBytes(file: string) {
  let string: string;
  let freehatscontract: FreeMagicalMathHats;
  let stringBuffer: Buffer;
  let gasEstimate: BigNumber;
  let tx: ContractTransaction;

  freehatscontract = await init();
  string = await base64_encode(file);
  stringBuffer = Buffer.from(string, "base64");
  gasEstimate = await freehatscontract.estimateGas.addFlair(stringBuffer);
  console.log(`Estimated gas to send ${file}: `, gasEstimate);
  tx = await freehatscontract.addFlair(stringBuffer);
  return tx;
}

export async function sendBytes(directory: string) {
  let freehatscontract: FreeMagicalMathHats;
  let files: string[];
  let baseColors: ContractTransaction;
  let flair: ContractTransaction;

  freehatscontract = await init();
  try {
    let byteCount: number;
    byteCount = 0;

    const sendAllBytes = async () => {
      if (directory == "./local-storage/free-hats/hats/") {
        files = await fs.readdir(directory);
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          baseColors = await sendBaseColorBytes(`${directory}${file}`);
          await baseColors.wait();
          console.log("TX HASH:", baseColors.hash);
          byteCount = files.length;
        }
      } else if (directory == "./local-storage/free-hats/flair/") {
        files = await fs.readdir(directory);
        console.log(directory)
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          flair = await sendFlairBytes(`${directory}${file}`);
          await flair.wait();
          console.log("TX HASH:", flair.hash);

          byteCount += files.length;
        }
      } else if (directory == "./local-storage/Test/backgrounds/") {
        files = await fs.readdir(directory);
        console.log(directory)
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          baseColors = await sendBaseColorBytes(`${directory}${file}`);
          await baseColors.wait();
          console.log("TX HASH:", baseColors.hash);
          byteCount += files.length;
        }        
      } else if (directory == "./local-storage/Test/pfps/"){
        files = await fs.readdir(directory);
        console.log(directory)
        for (let i = 0; i < files.length; i++) {
          let file = files[i];
          flair = await sendFlairBytes(`${directory}${file}`);
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

async function fullSend() {
await sendBytes("./local-storage/free-hats/hats/");
await sendBytes("./local-storage/free-hats/flair/");
}

fullSend();
// sendBytes("./local-storage/Test/backgrounds/");
// sendBytes("./local-storage/Test/pfps/");