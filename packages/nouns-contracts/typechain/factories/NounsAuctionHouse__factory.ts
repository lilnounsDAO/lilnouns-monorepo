/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";

import type { NounsAuctionHouse } from "../NounsAuctionHouse";

export class NounsAuctionHouse__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<NounsAuctionHouse> {
    return super.deploy(overrides || {}) as Promise<NounsAuctionHouse>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): NounsAuctionHouse {
    return super.attach(address) as NounsAuctionHouse;
  }
  connect(signer: Signer): NounsAuctionHouse__factory {
    return super.connect(signer) as NounsAuctionHouse__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): NounsAuctionHouse {
    return new Contract(address, _abi, signerOrProvider) as NounsAuctionHouse;
  }
}

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nounId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "extended",
        type: "bool",
      },
    ],
    name: "AuctionBid",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nounId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "AuctionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "duration",
        type: "uint256",
      },
    ],
    name: "AuctionDurationUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nounId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
    ],
    name: "AuctionExtended",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "minBidIncrementPercentage",
        type: "uint256",
      },
    ],
    name: "AuctionMinBidIncrementPercentageUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "reservePrice",
        type: "uint256",
      },
    ],
    name: "AuctionReservePriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "nounId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "winner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "AuctionSettled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "timeBuffer",
        type: "uint256",
      },
    ],
    name: "AuctionTimeBufferUpdated",
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
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [],
    name: "auction",
    outputs: [
      {
        internalType: "uint256",
        name: "nounId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "startTime",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256",
      },
      {
        internalType: "address payable",
        name: "bidder",
        type: "address",
      },
      {
        internalType: "bool",
        name: "settled",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nounId",
        type: "uint256",
      },
    ],
    name: "createBid",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "duration",
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
        internalType: "contract INounsToken",
        name: "_nouns",
        type: "address",
      },
      {
        internalType: "address",
        name: "_weth",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_timeBuffer",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_reservePrice",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "_minBidIncrementPercentage",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "minBidIncrementPercentage",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nouns",
    outputs: [
      {
        internalType: "contract INounsToken",
        name: "",
        type: "address",
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
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
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
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "reservePrice",
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
        name: "_duration",
        type: "uint256",
      },
    ],
    name: "setDuration",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint8",
        name: "_minBidIncrementPercentage",
        type: "uint8",
      },
    ],
    name: "setMinBidIncrementPercentage",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_reservePrice",
        type: "uint256",
      },
    ],
    name: "setReservePrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_timeBuffer",
        type: "uint256",
      },
    ],
    name: "setTimeBuffer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "settleAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "settleCurrentAndCreateNewAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "timeBuffer",
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
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
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
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506122b2806100206000396000f3fe60806040526004361061016a5760003560e01c80638456cb59116100cb578063ce9c7c0d1161007f578063f25efffc11610059578063f25efffc14610445578063f2fde38b1461045a578063f6be71d11461047a57600080fd5b8063ce9c7c0d146103f9578063db2e1eed14610419578063ec91f2a41461042f57600080fd5b80638da5cb5b116100b05780638da5cb5b1461038d578063a4d0a17e146103b8578063b296024d146103cd57600080fd5b80638456cb591461035857806387f49f541461036d57600080fd5b80635c975abb116101225780637120334b116101075780637120334b14610284578063715018a6146102a45780637d9f6db5146102b957600080fd5b80635c975abb1461024e578063659dd2b41461027157600080fd5b806336ebdb381161015357806336ebdb38146101ea5780633f4ba83a1461020c5780633fc8cef31461022157600080fd5b80630fb5a6b41461016f5780632de45f1814610198575b600080fd5b34801561017b57600080fd5b5061018560ce5481565b6040519081526020015b60405180910390f35b3480156101a457600080fd5b5060c9546101c59073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161018f565b3480156101f657600080fd5b5061020a610205366004612003565b61049a565b005b34801561021857600080fd5b5061020a61056d565b34801561022d57600080fd5b5060ca546101c59073ffffffffffffffffffffffffffffffffffffffff1681565b34801561025a57600080fd5b5060335460ff16604051901515815260200161018f565b61020a61027f366004611fd1565b610614565b34801561029057600080fd5b5061020a61029f366004611fd1565b610998565b3480156102b057600080fd5b5061020a610a34565b3480156102c557600080fd5b5060cf5460d05460d15460d25460d354610313949392919073ffffffffffffffffffffffffffffffffffffffff81169074010000000000000000000000000000000000000000900460ff1686565b60408051968752602087019590955293850192909252606084015273ffffffffffffffffffffffffffffffffffffffff166080830152151560a082015260c00161018f565b34801561036457600080fd5b5061020a610aa5565b34801561037957600080fd5b5061020a610388366004611f6e565b610b14565b34801561039957600080fd5b5060975473ffffffffffffffffffffffffffffffffffffffff166101c5565b3480156103c457600080fd5b5061020a610cac565b3480156103d957600080fd5b5060cd546103e79060ff1681565b60405160ff909116815260200161018f565b34801561040557600080fd5b5061020a610414366004611fd1565b610d65565b34801561042557600080fd5b5061018560cc5481565b34801561043b57600080fd5b5061018560cb5481565b34801561045157600080fd5b5061020a610e01565b34801561046657600080fd5b5061020a610475366004611f28565b610ebc565b34801561048657600080fd5b5061020a610495366004611fd1565b610fb8565b60975473ffffffffffffffffffffffffffffffffffffffff1633146105065760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b60cd80547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660ff83169081179091556040519081527fec5ccd96cc77b6219e9d44143df916af68fc169339ea7de5008ff15eae13450d906020015b60405180910390a150565b60975473ffffffffffffffffffffffffffffffffffffffff1633146105d45760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b6105dc611054565b60d1541580610605575060d35474010000000000000000000000000000000000000000900460ff165b156106125761061261111b565b565b600260655414156106675760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016104fd565b60026065556040805160c08101825260cf5480825260d054602083015260d1549282019290925260d254606082015260d35473ffffffffffffffffffffffffffffffffffffffff8116608083015274010000000000000000000000000000000000000000900460ff16151560a08201529082146107265760405162461bcd60e51b815260206004820152601b60248201527f4c696c204e6f756e206e6f7420757020666f722061756374696f6e000000000060448201526064016104fd565b806060015142106107795760405162461bcd60e51b815260206004820152600f60248201527f41756374696f6e2065787069726564000000000000000000000000000000000060448201526064016104fd565b60cc543410156107cb5760405162461bcd60e51b815260206004820152601f60248201527f4d7573742073656e64206174206c65617374207265736572766550726963650060448201526064016104fd565b60cd5460208201516064916107e59160ff909116906120ac565b6107ef9190612071565b81602001516107fe9190612059565b341015610875576040805162461bcd60e51b81526020600482015260248101919091527f4d7573742073656e64206d6f7265207468616e206c617374206269642062792060448201527f6d696e426964496e6372656d656e7450657263656e7461676520616d6f756e7460648201526084016104fd565b608081015173ffffffffffffffffffffffffffffffffffffffff8116156108a4576108a48183602001516112d2565b3460d05560d380547fffffffffffffffffffffffff0000000000000000000000000000000000000000163317905560cb546060830151600091906108e99042906120e9565b109050801561090a5760cb546108ff9042612059565b6060840181905260d2555b8251604080513381523460208201528315158183015290517f1159164c56f277e6fc99c11731bd380e0347deb969b75523398734c252706ea39181900360600190a2801561098d57825160608401516040519081527f6e912a3a9105bdd2af817ba5adc14e6c127c1035b5b648faa29ca0d58ab8ff4e9060200160405180910390a25b505060016065555050565b60975473ffffffffffffffffffffffffffffffffffffffff1633146109ff5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b60cb8190556040518181527f1b55d9f7002bda4490f467e326f22a4a847629c0f2d1ed421607d318d25b410d90602001610562565b60975473ffffffffffffffffffffffffffffffffffffffff163314610a9b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b6106126000611416565b60975473ffffffffffffffffffffffffffffffffffffffff163314610b0c5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b61061261148d565b600054610100900460ff1680610b2d575060005460ff16155b610b9f5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff16158015610bc1576000805461ffff19166101011790555b610bc9611533565b610bd1611621565b610bd96116d6565b610be161148d565b60c9805473ffffffffffffffffffffffffffffffffffffffff808a167fffffffffffffffffffffffff00000000000000000000000000000000000000009283161790925560ca80549289169290911691909117905560cb85905560cc84905560cd805460ff85167fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0090911617905560ce8290558015610ca357600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff1690555b50505050505050565b60335460ff16610cfe5760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f742070617573656400000000000000000000000060448201526064016104fd565b60026065541415610d515760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016104fd565b6002606555610d5e611793565b6001606555565b60975473ffffffffffffffffffffffffffffffffffffffff163314610dcc5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b60cc8190556040518181527f6ab2e127d7fdf53b8f304e59d3aab5bfe97979f52a85479691a6fab27a28a6b290602001610562565b60026065541415610e545760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c0060448201526064016104fd565b600260655560335460ff1615610eac5760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a207061757365640000000000000000000000000000000060448201526064016104fd565b610eb4611793565b610d5e61111b565b60975473ffffffffffffffffffffffffffffffffffffffff163314610f235760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b73ffffffffffffffffffffffffffffffffffffffff8116610fac5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f646472657373000000000000000000000000000000000000000000000000000060648201526084016104fd565b610fb581611416565b50565b60975473ffffffffffffffffffffffffffffffffffffffff16331461101f5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064016104fd565b60ce8190556040518181527faab6389d8f1c16ba1deb6e9831f5c5442cf4fcf99bf5bfa867460be408a9111890602001610562565b60335460ff166110a65760405162461bcd60e51b815260206004820152601460248201527f5061757361626c653a206e6f742070617573656400000000000000000000000060448201526064016104fd565b603380547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690557f5db9ee0a495bf2e6ff9c91a7834c1ba4fdd244a5e8aa4e537bd38aeae4b073aa335b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200160405180910390a1565b60c960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16631249c58b6040518163ffffffff1660e01b8152600401602060405180830381600087803b15801561118557600080fd5b505af19250505080156111d3575060408051601f3d9081017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01682019092526111d091810190611fea565b60015b611213576111df6121a1565b806308c379a0141561120757506111f46121bd565b806111ff5750611209565b610fb561148d565b505b3d6000803e3d6000fd5b60ce5442906000906112259083612059565b6040805160c08101825285815260006020808301829052828401879052606083018590526080830182905260a090920181905260cf87905560d05560d185905560d283905560d380547fffffffffffffffffffffff000000000000000000000000000000000000000000169055815185815290810183905291925084917fd6eddd1118d71820909c1197aa966dbc15ed6f508554252169cc3d5ccac756ca910160405180910390a2505050565b6112dc8282611b0b565b6114125760ca60009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663d0e30db0826040518263ffffffff1660e01b81526004016000604051808303818588803b15801561134a57600080fd5b505af115801561135e573d6000803e3d6000fd5b505060ca546040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff878116600483015260248201879052909116935063a9059cbb92506044019050602060405180830381600087803b1580156113d857600080fd5b505af11580156113ec573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906114109190611f4c565b505b5050565b6097805473ffffffffffffffffffffffffffffffffffffffff8381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b60335460ff16156114e05760405162461bcd60e51b815260206004820152601060248201527f5061757361626c653a207061757365640000000000000000000000000000000060448201526064016104fd565b603380547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001660011790557f62e78cea01bee320cd4e420270b5ea74000d11b0c9f74754ebdbfc544b05a2586110f13390565b600054610100900460ff168061154c575060005460ff16155b6115be5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff161580156115e0576000805461ffff19166101011790555b6115e8611b96565b6115f0611c73565b8015610fb557600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b600054610100900460ff168061163a575060005460ff16155b6116ac5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff161580156116ce576000805461ffff19166101011790555b6115f0611d79565b600054610100900460ff16806116ef575060005460ff16155b6117615760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff16158015611783576000805461ffff19166101011790555b61178b611b96565b6115f0611e5c565b6040805160c08101825260cf54815260d054602082015260d15491810182905260d254606082015260d35473ffffffffffffffffffffffffffffffffffffffff8116608083015274010000000000000000000000000000000000000000900460ff16151560a0820152906118495760405162461bcd60e51b815260206004820152601460248201527f41756374696f6e206861736e277420626567756e00000000000000000000000060448201526064016104fd565b8060a001511561189b5760405162461bcd60e51b815260206004820181905260248201527f41756374696f6e2068617320616c7265616479206265656e20736574746c656460448201526064016104fd565b80606001514210156118ef5760405162461bcd60e51b815260206004820152601860248201527f41756374696f6e206861736e277420636f6d706c65746564000000000000000060448201526064016104fd565b60d380547fffffffffffffffffffffff00ffffffffffffffffffffffffffffffffffffffff1674010000000000000000000000000000000000000000179055608081015173ffffffffffffffffffffffffffffffffffffffff166119de5760c95481516040517f42966c6800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff909216916342966c68916119a79160040190815260200190565b600060405180830381600087803b1580156119c157600080fd5b505af11580156119d5573d6000803e3d6000fd5b50505050611a78565b60c954608082015182516040517f23b872dd00000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff928316602482015260448101919091529116906323b872dd90606401600060405180830381600087803b158015611a5f57600080fd5b505af1158015611a73573d6000803e3d6000fd5b505050505b602081015115611aae57611aae611aa460975473ffffffffffffffffffffffffffffffffffffffff1690565b82602001516112d2565b805160808201516020808401516040805173ffffffffffffffffffffffffffffffffffffffff9094168452918301527fc9f72b276a388619c6d185d146697036241880c36654b1a3ffdad07c24038d99910160405180910390a250565b60408051600080825260208201909252819073ffffffffffffffffffffffffffffffffffffffff851690617530908590604051611b48919061201e565b600060405180830381858888f193505050503d8060008114611b86576040519150601f19603f3d011682016040523d82523d6000602084013e611b8b565b606091505b509095945050505050565b600054610100900460ff1680611baf575060005460ff16155b611c215760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff161580156115f0576000805461ffff19166101011790558015610fb557600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b600054610100900460ff1680611c8c575060005460ff16155b611cfe5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff16158015611d20576000805461ffff19166101011790555b603380547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690558015610fb557600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b600054610100900460ff1680611d92575060005460ff16155b611e045760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff16158015611e26576000805461ffff19166101011790555b60016065558015610fb557600080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00ff16905550565b600054610100900460ff1680611e75575060005460ff16155b611ee75760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201527f647920696e697469616c697a656400000000000000000000000000000000000060648201526084016104fd565b600054610100900460ff16158015611f09576000805461ffff19166101011790555b6115f033611416565b803560ff81168114611f2357600080fd5b919050565b600060208284031215611f3a57600080fd5b8135611f458161225a565b9392505050565b600060208284031215611f5e57600080fd5b81518015158114611f4557600080fd5b60008060008060008060c08789031215611f8757600080fd5b8635611f928161225a565b95506020870135611fa28161225a565b94506040870135935060608701359250611fbe60808801611f12565b915060a087013590509295509295509295565b600060208284031215611fe357600080fd5b5035919050565b600060208284031215611ffc57600080fd5b5051919050565b60006020828403121561201557600080fd5b611f4582611f12565b6000825160005b8181101561203f5760208186018101518583015201612025565b8181111561204e576000828501525b509190910192915050565b6000821982111561206c5761206c612172565b500190565b6000826120a7577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b6000817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff04831182151516156120e4576120e4612172565b500290565b6000828210156120fb576120fb612172565b500390565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0601f830116810181811067ffffffffffffffff8211171561216b577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040525050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600060033d11156121ba5760046000803e5060005160e01c5b90565b600060443d10156121cb5790565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc803d016004833e81513d67ffffffffffffffff816024840111818411171561221957505050505090565b82850191508151818111156122315750505050505090565b843d870101602082850101111561224b5750505050505090565b611b8b60208286010187612100565b73ffffffffffffffffffffffffffffffffffffffff81168114610fb557600080fdfea2646970667358221220372f18a03fa628df2f67629b83ca0609333a4c74ec6b159d3410a2d939a860c664736f6c63430008060033";
