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
} from "../../common";

export declare namespace INounsSeeder {
  export type SeedStruct = {
    background: PromiseOrValue<BigNumberish>;
    body: PromiseOrValue<BigNumberish>;
    accessory: PromiseOrValue<BigNumberish>;
    head: PromiseOrValue<BigNumberish>;
    glasses: PromiseOrValue<BigNumberish>;
  };

  export type SeedStructOutput = [number, number, number, number, number] & {
    background: number;
    body: number;
    accessory: number;
    head: number;
    glasses: number;
  };
}

export interface INounsDescriptorInterface extends utils.Interface {
  functions: {
    "accessories(uint256)": FunctionFragment;
    "accessoryCount()": FunctionFragment;
    "addAccessory(bytes)": FunctionFragment;
    "addBackground(string)": FunctionFragment;
    "addBody(bytes)": FunctionFragment;
    "addColorToPalette(uint8,string)": FunctionFragment;
    "addGlasses(bytes)": FunctionFragment;
    "addHead(bytes)": FunctionFragment;
    "addManyAccessories(bytes[])": FunctionFragment;
    "addManyBackgrounds(string[])": FunctionFragment;
    "addManyBodies(bytes[])": FunctionFragment;
    "addManyColorsToPalette(uint8,string[])": FunctionFragment;
    "addManyGlasses(bytes[])": FunctionFragment;
    "addManyHeads(bytes[])": FunctionFragment;
    "arePartsLocked()": FunctionFragment;
    "backgroundCount()": FunctionFragment;
    "backgrounds(uint256)": FunctionFragment;
    "baseURI()": FunctionFragment;
    "bodies(uint256)": FunctionFragment;
    "bodyCount()": FunctionFragment;
    "dataURI(uint256,(uint48,uint48,uint48,uint48,uint48))": FunctionFragment;
    "generateSVGImage((uint48,uint48,uint48,uint48,uint48))": FunctionFragment;
    "genericDataURI(string,string,(uint48,uint48,uint48,uint48,uint48))": FunctionFragment;
    "glasses(uint256)": FunctionFragment;
    "glassesCount()": FunctionFragment;
    "headCount()": FunctionFragment;
    "heads(uint256)": FunctionFragment;
    "isDataURIEnabled()": FunctionFragment;
    "lockParts()": FunctionFragment;
    "palettes(uint8,uint256)": FunctionFragment;
    "setBaseURI(string)": FunctionFragment;
    "toggleDataURIEnabled()": FunctionFragment;
    "tokenURI(uint256,(uint48,uint48,uint48,uint48,uint48))": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "accessories"
      | "accessoryCount"
      | "addAccessory"
      | "addBackground"
      | "addBody"
      | "addColorToPalette"
      | "addGlasses"
      | "addHead"
      | "addManyAccessories"
      | "addManyBackgrounds"
      | "addManyBodies"
      | "addManyColorsToPalette"
      | "addManyGlasses"
      | "addManyHeads"
      | "arePartsLocked"
      | "backgroundCount"
      | "backgrounds"
      | "baseURI"
      | "bodies"
      | "bodyCount"
      | "dataURI"
      | "generateSVGImage"
      | "genericDataURI"
      | "glasses"
      | "glassesCount"
      | "headCount"
      | "heads"
      | "isDataURIEnabled"
      | "lockParts"
      | "palettes"
      | "setBaseURI"
      | "toggleDataURIEnabled"
      | "tokenURI"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "accessories",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "accessoryCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "addAccessory",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "addBackground",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addBody",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "addColorToPalette",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "addGlasses",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "addHead",
    values: [PromiseOrValue<BytesLike>]
  ): string;
  encodeFunctionData(
    functionFragment: "addManyAccessories",
    values: [PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addManyBackgrounds",
    values: [PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addManyBodies",
    values: [PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addManyColorsToPalette",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<string>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addManyGlasses",
    values: [PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "addManyHeads",
    values: [PromiseOrValue<BytesLike>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "arePartsLocked",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "backgroundCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "backgrounds",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "baseURI", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "bodies",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(functionFragment: "bodyCount", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "dataURI",
    values: [PromiseOrValue<BigNumberish>, INounsSeeder.SeedStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "generateSVGImage",
    values: [INounsSeeder.SeedStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "genericDataURI",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<string>,
      INounsSeeder.SeedStruct
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "glasses",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "glassesCount",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "headCount", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "heads",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "isDataURIEnabled",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "lockParts", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "palettes",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "setBaseURI",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "toggleDataURIEnabled",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [PromiseOrValue<BigNumberish>, INounsSeeder.SeedStruct]
  ): string;

  decodeFunctionResult(
    functionFragment: "accessories",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "accessoryCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addAccessory",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addBackground",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addBody", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addColorToPalette",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "addGlasses", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "addHead", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "addManyAccessories",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addManyBackgrounds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addManyBodies",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addManyColorsToPalette",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addManyGlasses",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addManyHeads",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "arePartsLocked",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "backgroundCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "backgrounds",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "baseURI", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bodies", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bodyCount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "dataURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "generateSVGImage",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "genericDataURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "glasses", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "glassesCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "headCount", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "heads", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isDataURIEnabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "lockParts", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "palettes", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setBaseURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "toggleDataURIEnabled",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;

  events: {
    "BaseURIUpdated(string)": EventFragment;
    "DataURIToggled(bool)": EventFragment;
    "PartsLocked()": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "BaseURIUpdated"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "DataURIToggled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PartsLocked"): EventFragment;
}

export interface BaseURIUpdatedEventObject {
  baseURI: string;
}
export type BaseURIUpdatedEvent = TypedEvent<
  [string],
  BaseURIUpdatedEventObject
>;

export type BaseURIUpdatedEventFilter = TypedEventFilter<BaseURIUpdatedEvent>;

export interface DataURIToggledEventObject {
  enabled: boolean;
}
export type DataURIToggledEvent = TypedEvent<
  [boolean],
  DataURIToggledEventObject
>;

export type DataURIToggledEventFilter = TypedEventFilter<DataURIToggledEvent>;

export interface PartsLockedEventObject {}
export type PartsLockedEvent = TypedEvent<[], PartsLockedEventObject>;

export type PartsLockedEventFilter = TypedEventFilter<PartsLockedEvent>;

export interface INounsDescriptor extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: INounsDescriptorInterface;

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
    accessories(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    accessoryCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    addAccessory(
      accessory: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addBackground(
      background: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addBody(
      body: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addColorToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      color: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addGlasses(
      glasses: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addHead(
      head: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addManyAccessories(
      accessories: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addManyBackgrounds(
      backgrounds: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addManyBodies(
      bodies: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addManyColorsToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      newColors: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addManyGlasses(
      glasses: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    addManyHeads(
      heads: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    arePartsLocked(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    backgroundCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    backgrounds(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    baseURI(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    bodies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    bodyCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    dataURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;

    generateSVGImage(
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;

    genericDataURI(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;

    glasses(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    glassesCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    headCount(overrides?: CallOverrides): Promise<[BigNumber]>;

    heads(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    isDataURIEnabled(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    lockParts(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    palettes(
      paletteIndex: PromiseOrValue<BigNumberish>,
      colorIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[string]>;

    setBaseURI(
      baseURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    toggleDataURIEnabled(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  accessories(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  accessoryCount(overrides?: CallOverrides): Promise<BigNumber>;

  addAccessory(
    accessory: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addBackground(
    background: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addBody(
    body: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addColorToPalette(
    paletteIndex: PromiseOrValue<BigNumberish>,
    color: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addGlasses(
    glasses: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addHead(
    head: PromiseOrValue<BytesLike>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addManyAccessories(
    accessories: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addManyBackgrounds(
    backgrounds: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addManyBodies(
    bodies: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addManyColorsToPalette(
    paletteIndex: PromiseOrValue<BigNumberish>,
    newColors: PromiseOrValue<string>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addManyGlasses(
    glasses: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  addManyHeads(
    heads: PromiseOrValue<BytesLike>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  arePartsLocked(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  backgroundCount(overrides?: CallOverrides): Promise<BigNumber>;

  backgrounds(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  baseURI(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  bodies(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  bodyCount(overrides?: CallOverrides): Promise<BigNumber>;

  dataURI(
    tokenId: PromiseOrValue<BigNumberish>,
    seed: INounsSeeder.SeedStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  generateSVGImage(
    seed: INounsSeeder.SeedStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  genericDataURI(
    name: PromiseOrValue<string>,
    description: PromiseOrValue<string>,
    seed: INounsSeeder.SeedStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  glasses(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  glassesCount(overrides?: CallOverrides): Promise<BigNumber>;

  headCount(overrides?: CallOverrides): Promise<BigNumber>;

  heads(
    index: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  isDataURIEnabled(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  lockParts(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  palettes(
    paletteIndex: PromiseOrValue<BigNumberish>,
    colorIndex: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<string>;

  setBaseURI(
    baseURI: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  toggleDataURIEnabled(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tokenURI(
    tokenId: PromiseOrValue<BigNumberish>,
    seed: INounsSeeder.SeedStruct,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    accessories(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    accessoryCount(overrides?: CallOverrides): Promise<BigNumber>;

    addAccessory(
      accessory: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    addBackground(
      background: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addBody(
      body: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    addColorToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      color: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    addGlasses(
      glasses: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    addHead(
      head: PromiseOrValue<BytesLike>,
      overrides?: CallOverrides
    ): Promise<void>;

    addManyAccessories(
      accessories: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    addManyBackgrounds(
      backgrounds: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    addManyBodies(
      bodies: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    addManyColorsToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      newColors: PromiseOrValue<string>[],
      overrides?: CallOverrides
    ): Promise<void>;

    addManyGlasses(
      glasses: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    addManyHeads(
      heads: PromiseOrValue<BytesLike>[],
      overrides?: CallOverrides
    ): Promise<void>;

    arePartsLocked(overrides?: CallOverrides): Promise<boolean>;

    backgroundCount(overrides?: CallOverrides): Promise<BigNumber>;

    backgrounds(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    baseURI(overrides?: CallOverrides): Promise<string>;

    bodies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    bodyCount(overrides?: CallOverrides): Promise<BigNumber>;

    dataURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    generateSVGImage(
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    genericDataURI(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<string>;

    glasses(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    glassesCount(overrides?: CallOverrides): Promise<BigNumber>;

    headCount(overrides?: CallOverrides): Promise<BigNumber>;

    heads(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    isDataURIEnabled(overrides?: CallOverrides): Promise<boolean>;

    lockParts(overrides?: CallOverrides): Promise<void>;

    palettes(
      paletteIndex: PromiseOrValue<BigNumberish>,
      colorIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<string>;

    setBaseURI(
      baseURI: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    toggleDataURIEnabled(overrides?: CallOverrides): Promise<void>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {
    "BaseURIUpdated(string)"(baseURI?: null): BaseURIUpdatedEventFilter;
    BaseURIUpdated(baseURI?: null): BaseURIUpdatedEventFilter;

    "DataURIToggled(bool)"(enabled?: null): DataURIToggledEventFilter;
    DataURIToggled(enabled?: null): DataURIToggledEventFilter;

    "PartsLocked()"(): PartsLockedEventFilter;
    PartsLocked(): PartsLockedEventFilter;
  };

  estimateGas: {
    accessories(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    accessoryCount(overrides?: CallOverrides): Promise<BigNumber>;

    addAccessory(
      accessory: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addBackground(
      background: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addBody(
      body: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addColorToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      color: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addGlasses(
      glasses: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addHead(
      head: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addManyAccessories(
      accessories: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addManyBackgrounds(
      backgrounds: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addManyBodies(
      bodies: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addManyColorsToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      newColors: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addManyGlasses(
      glasses: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    addManyHeads(
      heads: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    arePartsLocked(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    backgroundCount(overrides?: CallOverrides): Promise<BigNumber>;

    backgrounds(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    baseURI(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    bodies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    bodyCount(overrides?: CallOverrides): Promise<BigNumber>;

    dataURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    generateSVGImage(
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    genericDataURI(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    glasses(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    glassesCount(overrides?: CallOverrides): Promise<BigNumber>;

    headCount(overrides?: CallOverrides): Promise<BigNumber>;

    heads(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isDataURIEnabled(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    lockParts(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    palettes(
      paletteIndex: PromiseOrValue<BigNumberish>,
      colorIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    setBaseURI(
      baseURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    toggleDataURIEnabled(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    accessories(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    accessoryCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    addAccessory(
      accessory: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addBackground(
      background: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addBody(
      body: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addColorToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      color: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addGlasses(
      glasses: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addHead(
      head: PromiseOrValue<BytesLike>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addManyAccessories(
      accessories: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addManyBackgrounds(
      backgrounds: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addManyBodies(
      bodies: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addManyColorsToPalette(
      paletteIndex: PromiseOrValue<BigNumberish>,
      newColors: PromiseOrValue<string>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addManyGlasses(
      glasses: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    addManyHeads(
      heads: PromiseOrValue<BytesLike>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    arePartsLocked(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    backgroundCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    backgrounds(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    baseURI(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    bodies(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bodyCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    dataURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    generateSVGImage(
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    genericDataURI(
      name: PromiseOrValue<string>,
      description: PromiseOrValue<string>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    glasses(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    glassesCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    headCount(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    heads(
      index: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isDataURIEnabled(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    lockParts(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    palettes(
      paletteIndex: PromiseOrValue<BigNumberish>,
      colorIndex: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    setBaseURI(
      baseURI: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    toggleDataURIEnabled(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: PromiseOrValue<BigNumberish>,
      seed: INounsSeeder.SeedStruct,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
