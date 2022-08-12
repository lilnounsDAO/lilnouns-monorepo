// SPDX-License-Identifier: GPL-3.0

/// @title Interface for NounsDescriptor

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

import { INounsSeeder } from './INounsSeeder.sol';

interface INounsDescriptor {
    event PartsLocked();

    event DataURIToggled(bool enabled);

    event BaseURIUpdated(string baseURI);

    function arePartsLocked() external returns (bool);

    function isDataURIEnabled() external returns (bool);

    function baseURI() external returns (string memory);

    function artstyles(uint256 index) external view returns (string memory);

    function backgrounds(uint256 index) external view returns (bytes memory);

    function basecolors(uint256 index) external view returns (bytes memory);

    function visors(uint256 index) external view returns (bytes memory);

    function mathletters(uint256 index) external view returns (bytes memory);

    function accessories(uint256 index) external view returns (bytes memory);

    function flair(uint256 index) external view returns (bytes memory);

    function artStyleCount() external view returns (uint256);

    function backgroundCount() external view returns (uint256);

    function baseColorCount() external view returns (uint256);

    function visorCount() external view returns (uint256);

    function mathlettersCount() external view returns (uint256);

    function accessoriesCount() external view returns (uint256);

    function flairCount() external view returns (uint256);

    function addManyBackgrounds(bytes[] calldata backgrounds) external;

    function addManyBaseColors(bytes[] calldata bodies) external;

    function addManyVisors(bytes[] calldata heads) external;

    function addManyMATHletters(bytes[] calldata glasses) external;

    function addManyAccessories(bytes[] calldata accessories) external;

    function addManyFlair(bytes[] calldata flair) external;

    function addArtStyle(string calldata artstyle) external;

    function addBackground(bytes calldata background) external;

    function addBaseColor(bytes calldata basecolor) external;

    function addVisor(bytes calldata visor) external;

    function addMATHletters(bytes calldata mathletters) external;

    function addAccessory(bytes calldata accessory) external;

    function addFlair(bytes calldata flair) external;

    function lockParts() external;

    function toggleDataURIEnabled() external;

    function setBaseURI(string calldata baseURI) external;

    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view returns (string memory);

    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view returns (string memory);

    function genericDataURI(
        string calldata name,
        string calldata description,
        INounsSeeder.Seed memory seed
    ) external view returns (string memory);

    function generateSVGImage(INounsSeeder.Seed memory seed) external view returns (string memory);
}
