// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsSeeder

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

import { INounsDescriptorMinimal } from "./INounsDescriptorMinimal.sol";
import { INounsSeeder } from "./INounsSeeder.sol";

interface INounsSeederV2 is INounsSeeder {
    // struct Seed {
    //     uint48 background;
    //     uint48 body;
    //     uint48 accessory;
    //     uint48 head;
    //     uint48 glasses;
    // }

    // function generateSeed(uint256 nounId, INounsDescriptorMinimal descriptor) external view returns (Seed memory);

    function generateSeedForBlock(
        uint256 nounId,
        INounsDescriptorMinimal descriptor,
        uint256 blockNumber
    ) external view returns (Seed memory);
}