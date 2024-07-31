// SPDX-License-Identifier: GPL-3.0

/// @title Interface for LilVRGDA

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

import { INounsSeederV2 } from "./INounsSeederV2.sol";

interface ILilVRGDA {
    // keep this the same for backwards compatibility
    event AuctionSettled(uint256 indexed nounId, address winner, uint256 amount);

    // keep this the same for backwards compatibility
    event AuctionReservePriceUpdated(uint256 reservePrice);

    event AuctionUpdateIntervalUpdated(uint256 interval);

    event PoolSizeUpdated(uint256 poolSize);

    function getSeederBlockNumber() external view returns (uint256);

    function buyNow(uint256 expectedBlockNumber, uint256 expectedNounId) external payable;

    function fetchNoun(
        uint256 blockNumber
    )
        external
        view
        returns (uint nounId, INounsSeederV2.Seed memory seed, string memory svg, uint256 price, bytes32 hash);

    function fetchNextNoun()
        external
        view
        returns (uint nounId, INounsSeederV2.Seed memory seed, string memory svg, uint256 price, bytes32 hash);

    function pause() external;

    function unpause() external;

    function setReservePrice(uint256 reservePrice) external;
}