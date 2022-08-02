/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { NounsDescriptor } from "../NounsDescriptor";

export class NounsDescriptor__factory extends ContractFactory {
  constructor(
    linkLibraryAddresses: NounsDescriptorLibraryAddresses,
    signer?: Signer
  ) {
    super(
      _abi,
      NounsDescriptor__factory.linkBytecode(linkLibraryAddresses),
      signer
    );
  }

  static linkBytecode(
    linkLibraryAddresses: NounsDescriptorLibraryAddresses
  ): string {
    let linkedBytecode = _bytecode;

    linkedBytecode = linkedBytecode.replace(
      new RegExp("__\\$e1d8844a0810dc0e87a665b1f2b5fa7c69\\$__", "g"),
      linkLibraryAddresses["__$e1d8844a0810dc0e87a665b1f2b5fa7c69$__"]
        .replace(/^0x/, "")
        .toLowerCase()
    );

    return linkedBytecode;
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NounsDescriptor> {
    return super.deploy(overrides || {}) as Promise<NounsDescriptor>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NounsDescriptor {
    return super.attach(address) as NounsDescriptor;
  }
  connect(signer: Signer): NounsDescriptor__factory {
    return super.connect(signer) as NounsDescriptor__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NounsDescriptor {
    return new Contract(address, _abi, signerOrProvider) as NounsDescriptor;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "baseURI",
        type: "string",
      },
    ],
    name: "BaseURIUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bool",
        name: "enabled",
        type: "bool",
      },
    ],
    name: "DataURIToggled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "PartsLocked",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "accessories",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "accessoriesCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_accessory",
        type: "bytes",
      },
    ],
    name: "addAccessory",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_artstyle",
        type: "string",
      },
    ],
    name: "addArtStyle",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_background",
        type: "bytes",
      },
    ],
    name: "addBackground",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_basecolor",
        type: "bytes",
      },
    ],
    name: "addBaseColor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_paletteIndex",
        type: "uint8",
      },
      {
        internalType: "string",
        name: "_color",
        type: "string",
      },
    ],
    name: "addColorToPalette",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_flair",
        type: "bytes",
      },
    ],
    name: "addFlair",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_mathletters",
        type: "bytes",
      },
    ],
    name: "addMATHletters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_accessories",
        type: "bytes[]",
      },
    ],
    name: "addManyAccessories",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_backgrounds",
        type: "bytes[]",
      },
    ],
    name: "addManyBackgrounds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "paletteIndex",
        type: "uint8",
      },
      {
        internalType: "string[]",
        name: "newColors",
        type: "string[]",
      },
    ],
    name: "addManyColorsToPalette",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_flair",
        type: "bytes[]",
      },
    ],
    name: "addManyFlair",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_mathletters",
        type: "bytes[]",
      },
    ],
    name: "addManyMATHletters",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_basecolors",
        type: "bytes[]",
      },
    ],
    name: "addManybasecolors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes[]",
        name: "_visors",
        type: "bytes[]",
      },
    ],
    name: "addManyvisors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_visor",
        type: "bytes",
      },
    ],
    name: "addVisor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "arePartsLocked",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "artStyleCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "artstyles",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "backgroundCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "backgrounds",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseColorCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "basecolors",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint48",
            name: "artstyle",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "background",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "basecolor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "visor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "mathletters",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "accessory",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "flair",
            type: "uint48",
          },
        ],
        internalType: "struct INounsSeeder.Seed",
        name: "seed",
        type: "tuple",
      },
    ],
    name: "dataURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "flair",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "flairCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint48",
            name: "artstyle",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "background",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "basecolor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "visor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "mathletters",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "accessory",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "flair",
            type: "uint48",
          },
        ],
        internalType: "struct INounsSeeder.Seed",
        name: "seed",
        type: "tuple",
      },
    ],
    name: "generateSVGImage",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "description",
        type: "string",
      },
      {
        components: [
          {
            internalType: "uint48",
            name: "artstyle",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "background",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "basecolor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "visor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "mathletters",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "accessory",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "flair",
            type: "uint48",
          },
        ],
        internalType: "struct INounsSeeder.Seed",
        name: "seed",
        type: "tuple",
      },
    ],
    name: "genericDataURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isDataURIEnabled",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lockParts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "mathletters",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "mathlettersCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "palettes",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_baseURI",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleDataURIEnabled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "uint48",
            name: "artstyle",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "background",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "basecolor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "visor",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "mathletters",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "accessory",
            type: "uint48",
          },
          {
            internalType: "uint48",
            name: "flair",
            type: "uint48",
          },
        ],
        internalType: "struct INounsSeeder.Seed",
        name: "seed",
        type: "tuple",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "visorCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "visors",
    outputs: [
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526000805460ff60a81b1916600160a81b17905534801561002357600080fd5b5061002d33610032565b610082565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b612ad8806100916000396000f3fe608060405234801561001057600080fd5b50600436106102e95760003560e01c8063839644da11610191578063cc1ef6b6116100e3578063ee9e4ba111610097578063f228ba7511610071578063f228ba75146105d9578063f2fde38b146105ec578063f9da8863146105ff57600080fd5b8063ee9e4ba1146105a0578063efd324a9146105b3578063f063dcdc146105c657600080fd5b8063ddb0df24116100c8578063ddb0df2414610572578063dfe8478b14610585578063e66449821461058d57600080fd5b8063cc1ef6b614610544578063ce2f4f531461054c57600080fd5b806398af4c0311610145578063a07822521161011f578063a07822521461050b578063a26fd1861461051e578063b8e1d2d31461053157600080fd5b806398af4c03146104dd57806398f0cc36146104e55780639a72ba5f146104f857600080fd5b80638da5cb5b116101765780638da5cb5b146104a557806390b29dde146104cd57806391434c2c146104d557600080fd5b8063839644da1461047f5780638c6ab78e1461049257600080fd5b806344448ac51161024a578063598fa9da116101fe578063715018a6116101d8578063715018a61461042f578063773b9771146104375780637ca942101461046c57600080fd5b8063598fa9da14610401578063631ecabd146104145780636c0360eb1461042757600080fd5b80634531c0a81161022f5780634531c0a8146103de5780634f2d88c7146103e657806355f804b3146103ee57600080fd5b806344448ac5146103b957806344df31d0146103cc57600080fd5b80631f34a35f116102a15780632a1d0769116102865780632a1d07691461038b5780632df1b0f8146103935780633a4d945f146103a657600080fd5b80631f34a35f14610365578063213319aa1461037857600080fd5b806317b552ab116102d257806317b552ab1461032c57806317cb132c1461033f5780631e6cf4301461035257600080fd5b80630475d863146102ee57806304bde4dd14610303575b600080fd5b6103016102fc366004612237565b610612565b005b6103166103113660046123af565b6106d8565b60405161032391906126dc565b60405180910390f35b61030161033a366004612279565b610784565b61030161034d366004612237565b610805565b610301610360366004612279565b6108c1565b6103166103733660046123af565b61093e565b6103166103863660046123c8565b61094e565b6103016109bc565b6103166103a136600461231d565b610a97565b6103166103b43660046123af565b610c0e565b6103016103c7366004612279565b610c1e565b6007545b604051908152602001610323565b6004546103d0565b6008546103d0565b6103016103fc366004612279565b610c30565b61031661040f36600461248f565b610c82565b610301610422366004612237565b610cba565b610316610d76565b610301610d83565b60005461045c9074010000000000000000000000000000000000000000900460ff1681565b6040519015158152602001610323565b61031661047a3660046123af565b610d97565b61030161048d3660046123f6565b610da7565b6103016104a0366004612279565b610e95565b60005460405173ffffffffffffffffffffffffffffffffffffffff9091168152602001610323565b6005546103d0565b6009546103d0565b6006546103d0565b6103016104f3366004612279565b610f12565b6103166105063660046123af565b610f8f565b6103166105193660046123af565b610f9f565b61030161052c366004612237565b610faf565b61030161053f366004612237565b61106b565b6003546103d0565b60005461045c907501000000000000000000000000000000000000000000900460ff1681565b610301610580366004612237565b611127565b6103016111e3565b61031661059b366004612393565b61126e565b6103016105ae366004612279565b6113d7565b6103166105c13660046123af565b611454565b6103016105d4366004612279565b611464565b6103166105e73660046123c8565b6114e1565b6103016105fa366004612201565b61154c565b61030161060d366004612449565b6115e9565b61061a611684565b60005474010000000000000000000000000000000000000000900460ff161561068a5760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b65640000000000000000000000000000000060448201526064015b60405180910390fd5b60005b818110156106d3576106c18383838181106106aa576106aa612a44565b90506020028101906106bc9190612818565b6116eb565b806106cb81612999565b91505061068d565b505050565b600481815481106106e857600080fd5b90600052602060002001600091509050805461070390612945565b80601f016020809104026020016040519081016040528092919081815260200182805461072f90612945565b801561077c5780601f106107515761010080835404028352916020019161077c565b820191906000526020600020905b81548152906001019060200180831161075f57829003601f168201915b505050505081565b61078c611684565b60005474010000000000000000000000000000000000000000900460ff16156107f75760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b61080182826116eb565b5050565b61080d611684565b60005474010000000000000000000000000000000000000000900460ff16156108785760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b60005b818110156106d3576108af83838381811061089857610898612a44565b90506020028101906108aa9190612818565b611728565b806108b981612999565b91505061087b565b6108c9611684565b60005474010000000000000000000000000000000000000000900460ff16156109345760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b6108018282611765565b600681815481106106e857600080fd5b6060600061095b846117a2565b9050600081604051602001610970919061262b565b60405160208183030381529060405290506000826040516020016109949190612670565b60405160208183030381529060405290506109b0828287610a97565b93505050505b92915050565b6109c4611684565b60005474010000000000000000000000000000000000000000900460ff1615610a2f5760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b600080547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff16740100000000000000000000000000000000000000001781556040517f1680ee6d421f70ed6030d2fc4fcb50217a5dd617858d56562b119eca59172e579190a1565b606060006040518060800160405280868152602001858152602001610abb856118dc565b81526020016003856000015165ffffffffffff1681548110610adf57610adf612a44565b906000526020600020018054610af490612945565b80601f0160208091040260200160405190810160405280929190818152602001828054610b2090612945565b8015610b6d5780601f10610b4257610100808354040283529160200191610b6d565b820191906000526020600020905b815481529060010190602001808311610b5057829003601f168201915b5050505050815250905073__$e1d8844a0810dc0e87a665b1f2b5fa7c69$__63bf1deae28260026040518363ffffffff1660e01b8152600401610bb1929190612785565b60006040518083038186803b158015610bc957600080fd5b505af4158015610bdd573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610c0591908101906122af565b95945050505050565b600981815481106106e857600080fd5b610c26611684565b6108018282611df5565b610c38611684565b610c4460018383611f87565b507f6741b2fc379fad678116fe3d4d4b9a1a184ab53ba36b86ad0fa66340b1ab41ad8282604051610c769291906126ef565b60405180910390a15050565b60026020528160005260406000208181548110610c9e57600080fd5b9060005260206000200160009150915050805461070390612945565b610cc2611684565b60005474010000000000000000000000000000000000000000900460ff1615610d2d5760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b60005b818110156106d357610d64838383818110610d4d57610d4d612a44565b9050602002810190610d5f9190612818565b611e32565b80610d6e81612999565b915050610d30565b6001805461070390612945565b610d8b611684565b610d956000611e6f565b565b600881815481106106e857600080fd5b610daf611684565b60ff831660009081526002602052604090205461010090610dd19083906128d6565b1115610e455760405162461bcd60e51b815260206004820152602160248201527f50616c65747465732063616e206f6e6c7920686f6c642032353620636f6c6f7260448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610681565b60005b81811015610e8f57610e7d84848484818110610e6657610e66612a44565b9050602002810190610e789190612818565b611ee4565b80610e8781612999565b915050610e48565b50505050565b610e9d611684565b60005474010000000000000000000000000000000000000000900460ff1615610f085760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b6108018282611f11565b610f1a611684565b60005474010000000000000000000000000000000000000000900460ff1615610f855760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b6108018282611f4e565b600381815481106106e857600080fd5b600581815481106106e857600080fd5b610fb7611684565b60005474010000000000000000000000000000000000000000900460ff16156110225760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b60005b818110156106d35761105983838381811061104257611042612a44565b90506020028101906110549190612818565b611f11565b8061106381612999565b915050611025565b611073611684565b60005474010000000000000000000000000000000000000000900460ff16156110de5760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b60005b818110156106d3576111158383838181106110fe576110fe612a44565b90506020028101906111109190612818565b611f4e565b8061111f81612999565b9150506110e1565b61112f611684565b60005474010000000000000000000000000000000000000000900460ff161561119a5760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b60005b818110156106d3576111d18383838181106111ba576111ba612a44565b90506020028101906111cc9190612818565b611765565b806111db81612999565b91505061119d565b6111eb611684565b600080547fffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffffff811675010000000000000000000000000000000000000000009182900460ff1615918202179091556040518181527f360c3d72ee193226275b842f85231c259c934e85459fed80fa68e502ffa9dbde9060200160405180910390a150565b606060006040518060400160405280611286856118dc565b81526020016003856020015165ffffffffffff16815481106112aa576112aa612a44565b9060005260206000200180546112bf90612945565b80601f01602080910402602001604051908101604052809291908181526020018280546112eb90612945565b80156113385780601f1061130d57610100808354040283529160200191611338565b820191906000526020600020905b81548152906001019060200180831161131b57829003601f168201915b5050505050815250905073__$e1d8844a0810dc0e87a665b1f2b5fa7c69$__6366b8c2418260026040518363ffffffff1660e01b815260040161137c92919061271e565b60006040518083038186803b15801561139457600080fd5b505af41580156113a8573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526113d091908101906122af565b9392505050565b6113df611684565b60005474010000000000000000000000000000000000000000900460ff161561144a5760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b6108018282611728565b600781815481106106e857600080fd5b61146c611684565b60005474010000000000000000000000000000000000000000900460ff16156114d75760405162461bcd60e51b815260206004820152601060248201527f506172747320617265206c6f636b6564000000000000000000000000000000006044820152606401610681565b6108018282611e32565b6000546060907501000000000000000000000000000000000000000000900460ff161561151957611512838361094e565b90506109b6565b6001611524846117a2565b604051602001611535929190612556565b604051602081830303815290604052905092915050565b611554611684565b73ffffffffffffffffffffffffffffffffffffffff81166115dd5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610681565b6115e681611e6f565b50565b6115f1611684565b60ff83811660009081526002602052604090205411156116795760405162461bcd60e51b815260206004820152602160248201527f50616c65747465732063616e206f6e6c7920686f6c642032353620636f6c6f7260448201527f73000000000000000000000000000000000000000000000000000000000000006064820152608401610681565b6106d3838383611ee4565b60005473ffffffffffffffffffffffffffffffffffffffff163314610d955760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610681565b600880546001810182556000919091526106d3907ff3f7a9fe364faab93b216da50a3214154f22a0a2b415b23a84c8169e8b636ee3018383611f87565b600980546001810182556000919091526106d3907f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af018383611f87565b600680546001810182556000919091526106d3907ff652222313e28459528d920b65115c16c04f3efc82aaedc97be59f3f377c0d3f018383611f87565b6060816117e257505060408051808201909152600181527f3000000000000000000000000000000000000000000000000000000000000000602082015290565b8160005b811561180c57806117f681612999565b91506118059050600a836128ee565b91506117e6565b60008167ffffffffffffffff81111561182757611827612a73565b6040519080825280601f01601f191660200182016040528015611851576020820181803683370190505b5090505b84156118d457611866600183612902565b9150611873600a866129d2565b61187e9060306128d6565b60f81b81838151811061189357611893612a44565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053506118cd600a866128ee565b9450611855565b949350505050565b60408051600580825260c0820190925260609160009190816020015b60608152602001906001900390816118f85790505090506004836020015165ffffffffffff168154811061192e5761192e612a44565b90600052602060002001805461194390612945565b80601f016020809104026020016040519081016040528092919081815260200182805461196f90612945565b80156119bc5780601f10611991576101008083540402835291602001916119bc565b820191906000526020600020905b81548152906001019060200180831161199f57829003601f168201915b5050505050816000815181106119d4576119d4612a44565b60200260200101819052506005836040015165ffffffffffff16815481106119fe576119fe612a44565b906000526020600020018054611a1390612945565b80601f0160208091040260200160405190810160405280929190818152602001828054611a3f90612945565b8015611a8c5780601f10611a6157610100808354040283529160200191611a8c565b820191906000526020600020905b815481529060010190602001808311611a6f57829003601f168201915b505050505081600181518110611aa457611aa4612a44565b60200260200101819052506006836060015165ffffffffffff1681548110611ace57611ace612a44565b906000526020600020018054611ae390612945565b80601f0160208091040260200160405190810160405280929190818152602001828054611b0f90612945565b8015611b5c5780601f10611b3157610100808354040283529160200191611b5c565b820191906000526020600020905b815481529060010190602001808311611b3f57829003601f168201915b505050505081600281518110611b7457611b74612a44565b60200260200101819052506007836080015165ffffffffffff1681548110611b9e57611b9e612a44565b906000526020600020018054611bb390612945565b80601f0160208091040260200160405190810160405280929190818152602001828054611bdf90612945565b8015611c2c5780601f10611c0157610100808354040283529160200191611c2c565b820191906000526020600020905b815481529060010190602001808311611c0f57829003601f168201915b505050505081600381518110611c4457611c44612a44565b602002602001018190525060088360a0015165ffffffffffff1681548110611c6e57611c6e612a44565b906000526020600020018054611c8390612945565b80601f0160208091040260200160405190810160405280929190818152602001828054611caf90612945565b8015611cfc5780601f10611cd157610100808354040283529160200191611cfc565b820191906000526020600020905b815481529060010190602001808311611cdf57829003601f168201915b505050505081600481518110611d1457611d14612a44565b602002602001018190525060098360c0015165ffffffffffff1681548110611d3e57611d3e612a44565b906000526020600020018054611d5390612945565b80601f0160208091040260200160405190810160405280929190818152602001828054611d7f90612945565b8015611dcc5780601f10611da157610100808354040283529160200191611dcc565b820191906000526020600020905b815481529060010190602001808311611daf57829003601f168201915b505050505081600581518110611de457611de4612a44565b602090810291909101015292915050565b600380546001810182556000919091526106d3907fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b018383611f87565b600480546001810182556000919091526106d3907f8a35acfbc15ff81a39ae7d344fd709f28e8600b4aa8c65c6b64bfe7fe36bd19b018383611f87565b6000805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b60ff83166000908152600260209081526040822080546001810182559083529120610e8f91018383611f87565b600780546001810182556000919091526106d3907fa66cc928b5edb82af9bd49922954155ab7b0942694bea4ce44661d9a8736c688018383611f87565b600580546001810182556000919091526106d3907f036b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db00183835b828054611f9390612945565b90600052602060002090601f016020900481019282611fb55760008555612019565b82601f10611fec578280017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00823516178555612019565b82800160010185558215612019579182015b82811115612019578235825591602001919060010190611ffe565b50612025929150612029565b5090565b5b80821115612025576000815560010161202a565b60008083601f84011261205057600080fd5b50813567ffffffffffffffff81111561206857600080fd5b6020830191508360208260051b850101111561208357600080fd5b9250929050565b60008083601f84011261209c57600080fd5b50813567ffffffffffffffff8111156120b457600080fd5b60208301915083602082850101111561208357600080fd5b600082601f8301126120dd57600080fd5b81356120f06120eb826128ae565b61287d565b81815284602083860101111561210557600080fd5b816020850160208301376000918101602001919091529392505050565b600060e0828403121561213457600080fd5b60405160e0810181811067ffffffffffffffff8211171561215757612157612a73565b604052905080612166836121d5565b8152612174602084016121d5565b6020820152612185604084016121d5565b6040820152612196606084016121d5565b60608201526121a7608084016121d5565b60808201526121b860a084016121d5565b60a08201526121c960c084016121d5565b60c08201525092915050565b803565ffffffffffff811681146121eb57600080fd5b919050565b803560ff811681146121eb57600080fd5b60006020828403121561221357600080fd5b813573ffffffffffffffffffffffffffffffffffffffff811681146113d057600080fd5b6000806020838503121561224a57600080fd5b823567ffffffffffffffff81111561226157600080fd5b61226d8582860161203e565b90969095509350505050565b6000806020838503121561228c57600080fd5b823567ffffffffffffffff8111156122a357600080fd5b61226d8582860161208a565b6000602082840312156122c157600080fd5b815167ffffffffffffffff8111156122d857600080fd5b8201601f810184136122e957600080fd5b80516122f76120eb826128ae565b81815285602083850101111561230c57600080fd5b610c05826020830160208601612919565b6000806000610120848603121561233357600080fd5b833567ffffffffffffffff8082111561234b57600080fd5b612357878388016120cc565b9450602086013591508082111561236d57600080fd5b5061237a868287016120cc565b92505061238a8560408601612122565b90509250925092565b600060e082840312156123a557600080fd5b6113d08383612122565b6000602082840312156123c157600080fd5b5035919050565b60008061010083850312156123dc57600080fd5b823591506123ed8460208501612122565b90509250929050565b60008060006040848603121561240b57600080fd5b612414846121f0565b9250602084013567ffffffffffffffff81111561243057600080fd5b61243c8682870161203e565b9497909650939450505050565b60008060006040848603121561245e57600080fd5b612467846121f0565b9250602084013567ffffffffffffffff81111561248357600080fd5b61243c8682870161208a565b600080604083850312156124a257600080fd5b6124ab836121f0565b946020939093013593505050565b600081518084526020808501808196508360051b8101915082860160005b858110156125015782840389526124ef84835161250e565b988501989350908401906001016124d7565b5091979650505050505050565b60008151808452612526816020860160208601612919565b601f01601f19169290920160200192915050565b6000815161254c818560208601612919565b9290920192915050565b600080845481600182811c91508083168061257257607f831692505b60208084108214156125ab577f4e487b710000000000000000000000000000000000000000000000000000000086526022600452602486fd5b8180156125bf57600181146125ee5761261b565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0086168952848901965061261b565b60008b81526020902060005b868110156126135781548b8201529085019083016125fa565b505084890196505b505050505050610c05818561253a565b7f4d41544820486174200000000000000000000000000000000000000000000000815260008251612663816009850160208701612919565b9190910160090192915050565b7f4d415448204861742000000000000000000000000000000000000000000000008152600082516126a8816009850160208701612919565b7f2069732061206d656d626572206f6620746865204657445f44414f00000000006009939091019283015250602401919050565b6020815260006113d0602083018461250e565b60208152816020820152818360408301376000818301604090810191909152601f909201601f19160101919050565b604081526000835160408084015261273960808401826124b9565b905060208501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0848303016060850152612774828261250e565b925050508260208301529392505050565b6040815260008351608060408401526127a160c084018261250e565b905060208501517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc0808584030160608601526127dd838361250e565b925060408701519150808584030160808601526127fa83836124b9565b925060608701519150808584030160a086015250612774828261250e565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261284d57600080fd5b83018035915067ffffffffffffffff82111561286857600080fd5b60200191503681900382131561208357600080fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156128a6576128a6612a73565b604052919050565b600067ffffffffffffffff8211156128c8576128c8612a73565b50601f01601f191660200190565b600082198211156128e9576128e96129e6565b500190565b6000826128fd576128fd612a15565b500490565b600082821015612914576129146129e6565b500390565b60005b8381101561293457818101518382015260200161291c565b83811115610e8f5750506000910152565b600181811c9082168061295957607f821691505b60208210811415612993577f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b50919050565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8214156129cb576129cb6129e6565b5060010190565b6000826129e1576129e1612a15565b500690565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fdfea2646970667358221220308e8e1d5a40627898e482785f328886f95c74ce032fcde0c4a9f091f689576b64736f6c63430008060033";

export interface NounsDescriptorLibraryAddresses {
  ["__$e1d8844a0810dc0e87a665b1f2b5fa7c69$__"]: string;
}
