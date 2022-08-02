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

pragma solidity ^0.8.6;

import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';

contract NounsSeeder is INounsSeeder {
    /**
     * @notice Generate a pseudo-random Noun seed using the previous blockhash and noun ID.
     */
    // prettier-ignore
    function generateSeed(uint256 nounId, INounsDescriptor descriptor) external view override returns (Seed memory) {
        uint256 pseudorandomness = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), nounId))
        );

        uint256 artStyleCount = descriptor.artStyleCount();
        uint256 backgroundCount = descriptor.backgroundCount();
        uint256 baseColorCount = descriptor.baseColorCount();
        uint256 visorCount = descriptor.visorCount();
        uint256 mathLettersCount = descriptor.mathlettersCount();
        uint256 accessoriesCount = descriptor.accessoriesCount();
        uint256 flairCount = descriptor.flairCount();

        return Seed({
            artstyle: uint48(
                uint48(pseudorandomness) % artStyleCount
            ),
            background: uint48(
                uint48(pseudorandomness) % backgroundCount
            ),
            basecolor: uint48(
                uint48(pseudorandomness >> 48) % baseColorCount
            ),
            visor: uint48(
                uint48(pseudorandomness >> 96) % visorCount
            ),
            mathletters: uint48(
                uint48(pseudorandomness >> 144) % mathLettersCount
            ),
            accessory: uint48(
                uint48(pseudorandomness >> 192) % accessoriesCount
            ),
            flair: uint48(
                uint48(pseudorandomness >> 240) % flairCount
            )
        });
    }
}
