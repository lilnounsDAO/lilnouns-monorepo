/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../../../common";

export interface INounsAuctionHouseInterface extends utils.Interface {
  functions: {
    "createBid(uint256)": FunctionFragment;
    "pause()": FunctionFragment;
    "setMinBidIncrementPercentage(uint8)": FunctionFragment;
    "setReservePrice(uint256)": FunctionFragment;
    "setTimeBuffer(uint256)": FunctionFragment;
    "settleAuction()": FunctionFragment;
    "settleCurrentAndCreateNewAuction()": FunctionFragment;
    "unpause()": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "createBid"
      | "pause"
      | "setMinBidIncrementPercentage"
      | "setReservePrice"
      | "setTimeBuffer"
      | "settleAuction"
      | "settleCurrentAndCreateNewAuction"
      | "unpause"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "createBid",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "pause", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "setMinBidIncrementPercentage",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setReservePrice",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setTimeBuffer",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "settleAuction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "settleCurrentAndCreateNewAuction",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "unpause", values?: undefined): string;

  decodeFunctionResult(functionFragment: "createBid", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "pause", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setMinBidIncrementPercentage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setReservePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setTimeBuffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settleAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settleCurrentAndCreateNewAuction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "unpause", data: BytesLike): Result;

  events: {
    "AuctionBid(uint256,address,uint256,bool)": EventFragment;
    "AuctionCreated(uint256,uint256,uint256)": EventFragment;
    "AuctionExtended(uint256,uint256)": EventFragment;
    "AuctionMinBidIncrementPercentageUpdated(uint256)": EventFragment;
    "AuctionReservePriceUpdated(uint256)": EventFragment;
    "AuctionSettled(uint256,address,uint256)": EventFragment;
    "AuctionTimeBufferUpdated(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "AuctionBid"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionCreated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionExtended"): EventFragment;
  getEvent(
    nameOrSignatureOrTopic: "AuctionMinBidIncrementPercentageUpdated"
  ): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionReservePriceUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionSettled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "AuctionTimeBufferUpdated"): EventFragment;
}

export interface AuctionBidEventObject {
  nounId: BigNumber;
  sender: string;
  value: BigNumber;
  extended: boolean;
}
export type AuctionBidEvent = TypedEvent<
  [BigNumber, string, BigNumber, boolean],
  AuctionBidEventObject
>;

export type AuctionBidEventFilter = TypedEventFilter<AuctionBidEvent>;

export interface AuctionCreatedEventObject {
  nounId: BigNumber;
  startTime: BigNumber;
  endTime: BigNumber;
}
export type AuctionCreatedEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber],
  AuctionCreatedEventObject
>;

export type AuctionCreatedEventFilter = TypedEventFilter<AuctionCreatedEvent>;

export interface AuctionExtendedEventObject {
  nounId: BigNumber;
  endTime: BigNumber;
}
export type AuctionExtendedEvent = TypedEvent<
  [BigNumber, BigNumber],
  AuctionExtendedEventObject
>;

export type AuctionExtendedEventFilter = TypedEventFilter<AuctionExtendedEvent>;

export interface AuctionMinBidIncrementPercentageUpdatedEventObject {
  minBidIncrementPercentage: BigNumber;
}
export type AuctionMinBidIncrementPercentageUpdatedEvent = TypedEvent<
  [BigNumber],
  AuctionMinBidIncrementPercentageUpdatedEventObject
>;

export type AuctionMinBidIncrementPercentageUpdatedEventFilter =
  TypedEventFilter<AuctionMinBidIncrementPercentageUpdatedEvent>;

export interface AuctionReservePriceUpdatedEventObject {
  reservePrice: BigNumber;
}
export type AuctionReservePriceUpdatedEvent = TypedEvent<
  [BigNumber],
  AuctionReservePriceUpdatedEventObject
>;

export type AuctionReservePriceUpdatedEventFilter =
  TypedEventFilter<AuctionReservePriceUpdatedEvent>;

export interface AuctionSettledEventObject {
  nounId: BigNumber;
  winner: string;
  amount: BigNumber;
}
export type AuctionSettledEvent = TypedEvent<
  [BigNumber, string, BigNumber],
  AuctionSettledEventObject
>;

export type AuctionSettledEventFilter = TypedEventFilter<AuctionSettledEvent>;

export interface AuctionTimeBufferUpdatedEventObject {
  timeBuffer: BigNumber;
}
export type AuctionTimeBufferUpdatedEvent = TypedEvent<
  [BigNumber],
  AuctionTimeBufferUpdatedEventObject
>;

export type AuctionTimeBufferUpdatedEventFilter =
  TypedEventFilter<AuctionTimeBufferUpdatedEvent>;

export interface INounsAuctionHouse extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: INounsAuctionHouseInterface;

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
    createBid(
      nounId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setMinBidIncrementPercentage(
      minBidIncrementPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setReservePrice(
      reservePrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    setTimeBuffer(
      timeBuffer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    settleAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    settleCurrentAndCreateNewAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  createBid(
    nounId: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  pause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setMinBidIncrementPercentage(
    minBidIncrementPercentage: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setReservePrice(
    reservePrice: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  setTimeBuffer(
    timeBuffer: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  settleAuction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  settleCurrentAndCreateNewAuction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  unpause(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createBid(
      nounId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    pause(overrides?: CallOverrides): Promise<void>;

    setMinBidIncrementPercentage(
      minBidIncrementPercentage: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setReservePrice(
      reservePrice: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    setTimeBuffer(
      timeBuffer: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    settleAuction(overrides?: CallOverrides): Promise<void>;

    settleCurrentAndCreateNewAuction(overrides?: CallOverrides): Promise<void>;

    unpause(overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "AuctionBid(uint256,address,uint256,bool)"(
      nounId?: PromiseOrValue<BigNumberish> | null,
      sender?: null,
      value?: null,
      extended?: null
    ): AuctionBidEventFilter;
    AuctionBid(
      nounId?: PromiseOrValue<BigNumberish> | null,
      sender?: null,
      value?: null,
      extended?: null
    ): AuctionBidEventFilter;

    "AuctionCreated(uint256,uint256,uint256)"(
      nounId?: PromiseOrValue<BigNumberish> | null,
      startTime?: null,
      endTime?: null
    ): AuctionCreatedEventFilter;
    AuctionCreated(
      nounId?: PromiseOrValue<BigNumberish> | null,
      startTime?: null,
      endTime?: null
    ): AuctionCreatedEventFilter;

    "AuctionExtended(uint256,uint256)"(
      nounId?: PromiseOrValue<BigNumberish> | null,
      endTime?: null
    ): AuctionExtendedEventFilter;
    AuctionExtended(
      nounId?: PromiseOrValue<BigNumberish> | null,
      endTime?: null
    ): AuctionExtendedEventFilter;

    "AuctionMinBidIncrementPercentageUpdated(uint256)"(
      minBidIncrementPercentage?: null
    ): AuctionMinBidIncrementPercentageUpdatedEventFilter;
    AuctionMinBidIncrementPercentageUpdated(
      minBidIncrementPercentage?: null
    ): AuctionMinBidIncrementPercentageUpdatedEventFilter;

    "AuctionReservePriceUpdated(uint256)"(
      reservePrice?: null
    ): AuctionReservePriceUpdatedEventFilter;
    AuctionReservePriceUpdated(
      reservePrice?: null
    ): AuctionReservePriceUpdatedEventFilter;

    "AuctionSettled(uint256,address,uint256)"(
      nounId?: PromiseOrValue<BigNumberish> | null,
      winner?: null,
      amount?: null
    ): AuctionSettledEventFilter;
    AuctionSettled(
      nounId?: PromiseOrValue<BigNumberish> | null,
      winner?: null,
      amount?: null
    ): AuctionSettledEventFilter;

    "AuctionTimeBufferUpdated(uint256)"(
      timeBuffer?: null
    ): AuctionTimeBufferUpdatedEventFilter;
    AuctionTimeBufferUpdated(
      timeBuffer?: null
    ): AuctionTimeBufferUpdatedEventFilter;
  };

  estimateGas: {
    createBid(
      nounId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setMinBidIncrementPercentage(
      minBidIncrementPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setReservePrice(
      reservePrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    setTimeBuffer(
      timeBuffer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    settleAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    settleCurrentAndCreateNewAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createBid(
      nounId: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    pause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setMinBidIncrementPercentage(
      minBidIncrementPercentage: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setReservePrice(
      reservePrice: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    setTimeBuffer(
      timeBuffer: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    settleAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    settleCurrentAndCreateNewAuction(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    unpause(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
