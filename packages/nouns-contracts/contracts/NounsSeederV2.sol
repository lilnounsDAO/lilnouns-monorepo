// SPDX-License-Identifier: GPL-3.0

/// @title The NounsToken pseudo-random seed generator

/*********************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░██░░░████░░██░░░████░░░ *
 * ░░██████░░░████████░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░██░░██░░░████░░██░░░████░░░ *
 * ░░░░░░█████████░░█████████░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 *********************************/

pragma solidity ^0.8.22;

import { ILilVRGDA } from "./interfaces/ILilVRGDA.sol";
import { INounsSeederV2 } from "./interfaces/INounsSeederV2.sol";
import { INounsDescriptorMinimal } from "./interfaces/INounsDescriptorMinimal.sol";

contract NounsSeederV2 is INounsSeederV2 {
    ILilVRGDA public lilVRGDA;

    constructor(address _lilVRGDA) {
        lilVRGDA = ILilVRGDA(_lilVRGDA);
    }

    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID, and block number.
     */
    // prettier-ignore
    function generateSeedForBlock(uint256 nounId, INounsDescriptorMinimal descriptor, uint256 blockNumber) public view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(keccak256(abi.encodePacked(blockhash(blockNumber), nounId)));


        uint256 backgroundCount = descriptor.backgroundCount();
        uint256 bodyCount = descriptor.bodyCount();
        uint256 accessoryCount = descriptor.accessoryCount();
        uint256 headCount = descriptor.headCount();
        uint256 glassesCount = descriptor.glassesCount();

        return Seed({
            background: uint48(
                uint48(pseudorandomness) % backgroundCount
            ),
            body: uint48(
                uint48(pseudorandomness >> 48) % bodyCount
            ),
            accessory: uint48(
                uint48(pseudorandomness >> 96) % accessoryCount
            ),
            head: uint48(
                uint48(pseudorandomness >> 144) % headCount
            ),
            glasses: uint48(
                uint48(pseudorandomness >> 192) % glassesCount
            )
        });
    }

    function generateSeed(uint256 nounId, INounsDescriptorMinimal descriptor) external view returns (Seed memory) {
        return generateSeedForBlock(nounId, descriptor, lilVRGDA.getSeederBlockNumber());
    }
}