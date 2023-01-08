/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../common";

export interface VoterInterface extends utils.Interface {
  functions: {
    "castVote()": FunctionFragment;
    "dao()": FunctionFragment;
    "proposalId()": FunctionFragment;
    "support()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "castVote" | "dao" | "proposalId" | "support"
  ): FunctionFragment;

  encodeFunctionData(functionFragment: "castVote", values?: undefined): string;
  encodeFunctionData(functionFragment: "dao", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "proposalId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "support", values?: undefined): string;

  decodeFunctionResult(functionFragment: "castVote", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "dao", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "proposalId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "support", data: BytesLike): Result;

  events: {};
}

export interface Voter extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: VoterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    castVote(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    dao(overrides?: CallOverrides): Promise<[string]>;

    proposalId(overrides?: CallOverrides): Promise<[BigNumber]>;

    support(overrides?: CallOverrides): Promise<[number]>;
  };

  castVote(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  dao(overrides?: CallOverrides): Promise<string>;

  proposalId(overrides?: CallOverrides): Promise<BigNumber>;

  support(overrides?: CallOverrides): Promise<number>;

  callStatic: {
    castVote(overrides?: CallOverrides): Promise<void>;

    dao(overrides?: CallOverrides): Promise<string>;

    proposalId(overrides?: CallOverrides): Promise<BigNumber>;

    support(overrides?: CallOverrides): Promise<number>;
  };

  filters: {};

  estimateGas: {
    castVote(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    dao(overrides?: CallOverrides): Promise<BigNumber>;

    proposalId(overrides?: CallOverrides): Promise<BigNumber>;

    support(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    castVote(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    dao(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    proposalId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    support(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
