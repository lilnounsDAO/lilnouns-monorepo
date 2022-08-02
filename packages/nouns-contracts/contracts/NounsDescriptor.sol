// SPDX-License-Identifier: GPL-3.0

/// @title The Nouns NFT descriptor

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

import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';
import { Strings } from '@openzeppelin/contracts/utils/Strings.sol';
import { INounsDescriptor } from './interfaces/INounsDescriptor.sol';
import { INounsSeeder } from './interfaces/INounsSeeder.sol';
import { NFTDescriptor } from './libs/NFTDescriptor.sol';
import { MultiPartRLEToSVG } from './libs/MultiPartRLEToSVG.sol';

contract NounsDescriptor is INounsDescriptor, Ownable {
    using Strings for uint256;

    // prettier-ignore
    // https://creativecommons.org/publicdomain/zero/1.0/legalcode.txt
    bytes32 constant COPYRIGHT_CC0_1_0_UNIVERSAL_LICENSE = 0xa2010f343487d3f7618affe54f789f5487602331c0a8d03f49e9a7c547cf0499;

    // Whether or not new Noun parts can be added
    bool public override arePartsLocked;

    // Whether or not `tokenURI` should be returned as a data URI (Default: true)
    bool public override isDataURIEnabled = true;

    // Base URI
    string public override baseURI;

    // Noun Color Palettes (Index => Hex Colors)
    mapping(uint8 => string[]) public override palettes;

    // MATH Hat Art Styles
    string[] public override artstyles;

    // MATH Hat Backgrounds
    bytes[] public override backgrounds;

    // MATH Hat Base Colors
    bytes[] public override basecolors;
    
    // MATH Hat Visors (Custom RLE)
    bytes[] public override visors;

    // MATH Hat Letters (Custom RLE)
    bytes[] public override mathletters;

    // MATH Hat Accessories (Custom RLE)
    bytes[] public override accessories;

    // MATH Hat Flair (Custom RLE)
    bytes[] public override flair;


    // 

    /**
     * @notice Require that the parts have not been locked.
     */
    modifier whenPartsNotLocked() {
        require(!arePartsLocked, 'Parts are locked');
        _;
    }

    /**
     * @notice Get the number of available MATH Hat Art Styles
     */

     function artStyleCount() external view returns (uint256) {
        return artstyles.length;
     }
    /**
     * @notice Get the number of available MATH Hat `backgrounds`.
     */
    function backgroundCount() external view override returns (uint256) {
        return backgrounds.length;
    }

    /**
     * @notice Get the number of available MATH Hat `basecolors`.
     */
    function baseColorCount() external view override returns (uint256) {
        return basecolors.length;
    }

    /**
     * @notice Get the number of available MATH Hat `visors`.
     */
    function visorCount() external view override returns (uint256) {
        return visors.length;
    }

    /**
     * @notice Get the number of available MATH Hat `mathletters`.
     */
    function mathlettersCount() external view override returns (uint256) {
        return mathletters.length;
    }

    /**
     * @notice Get the number of available MATH Hat `accessories`.
     */
    function accessoriesCount() external view override returns (uint256) {
        return accessories.length;
    }

    /**
     * @notice Get the number of available MATH Hat `flair`.
     */
    function flairCount() external view override returns (uint256) {
        return flair.length;
    }


    /**
     * @notice Add colors to a color palette.
     * @dev This function can only be called by the owner.
     */
    function addManyColorsToPalette(uint8 paletteIndex, string[] calldata newColors) external override onlyOwner {
        require(palettes[paletteIndex].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    /**
     * @notice Batch add MATH Hat backgrounds.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyBackgrounds(bytes[] calldata _backgrounds) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _backgrounds.length; i++) {
            _addBackground(_backgrounds[i]);
        }
    }

    /**
     * @notice Batch add MATH Hat basecolors.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManybasecolors(bytes[] calldata _basecolors) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _basecolors.length; i++) {
            _addBaseColor(_basecolors[i]);
        }
    }

    /**
     * @notice Batch add MATH Hat visors.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyvisors(bytes[] calldata _visors) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _visors.length; i++) {
            _addVisor(_visors[i]);
        }
    }

    /**
     * @notice Batch add MATH Hat mathletters.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyMATHletters(bytes[] calldata _mathletters) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _mathletters.length; i++) {
            _addmathletters(_mathletters[i]);
        }
    }

    /**
     * @notice Batch add MATH Hat accessories.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyAccessories(bytes[] calldata _accessories) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _accessories.length; i++) {
            _addAccessory(_accessories[i]);
        }
    }

    /**
     * @notice Batch add MATH Hat flair.
     * @dev This function can only be called by the owner when not locked.
     */
    function addManyFlair(bytes[] calldata _flair) external override onlyOwner whenPartsNotLocked {
        for (uint256 i = 0; i < _flair.length; i++) {
            _addFlair(_flair[i]);
        }
    }    

    /**
     * @notice Add a single color to a color palette.
     * @dev This function can only be called by the owner.
     */
    function addColorToPalette(uint8 _paletteIndex, string calldata _color) external override onlyOwner {
        require(palettes[_paletteIndex].length <= 255, 'Palettes can only hold 256 colors');
        _addColorToPalette(_paletteIndex, _color);
    }

    /**
     * @notice Add a Noun background.
     * @dev This function can only be called by the owner when not locked.
     */
    function addBackground(bytes calldata _background) external override onlyOwner whenPartsNotLocked {
        _addBackground(_background);
    }

    /**
     * @notice Add a MATH Hat Base Color
     * @dev This function can only be called by the owner when not locked.
     */
    function addBaseColor(bytes calldata _basecolor) external override onlyOwner whenPartsNotLocked {
        _addBaseColor(_basecolor);
    }

    /**
     * @notice Add a MATH Hat Visor.
     * @dev This function can only be called by the owner when not locked.
     */
    function addVisor(bytes calldata _visor) external override onlyOwner whenPartsNotLocked {
        _addVisor(_visor);
    }

    /**
     * @notice Add a Noun accessory.
     * @dev This function can only be called by the owner when not locked.
     */
    function addAccessory(bytes calldata _accessory) external override onlyOwner whenPartsNotLocked {
        _addAccessory(_accessory);
    }

    /**
     * @notice Add Noun mathletters.
     * @dev This function can only be called by the owner when not locked.
     */
    function addMATHletters(bytes calldata _mathletters) external override onlyOwner whenPartsNotLocked {
        _addmathletters(_mathletters);
    }

    /**
     * @notice Add a MATH Hat Flair
     * @dev This function can only be called by the owner when not locked.
     */
    function addFlair(bytes calldata _flair) external override onlyOwner whenPartsNotLocked {
        _addFlair(_flair);
    }

    /**
     * @notice Lock all Noun parts.
     * @dev This cannot be reversed and can only be called by the owner when not locked.
     */
    function lockParts() external override onlyOwner whenPartsNotLocked {
        arePartsLocked = true;

        emit PartsLocked();
    }

    /**
     * @notice Toggle a boolean value which determines if `tokenURI` returns a data URI
     * or an HTTP URL.
     * @dev This can only be called by the owner.
     */
    function toggleDataURIEnabled() external override onlyOwner {
        bool enabled = !isDataURIEnabled;

        isDataURIEnabled = enabled;
        emit DataURIToggled(enabled);
    }

    /**
     * @notice Set the base URI for all token IDs. It is automatically
     * added as a prefix to the value returned in {tokenURI}, or to the
     * token ID if {tokenURI} is empty.
     * @dev This can only be called by the owner.
     */
    function setBaseURI(string calldata _baseURI) external override onlyOwner {
        baseURI = _baseURI;

        emit BaseURIUpdated(_baseURI);
    }

    /**
     * @notice Given a token ID and seed, construct a token URI for an official Nouns DAO noun.
     * @dev The returned value may be a base64 encoded data URI or an API URL.
     */
    function tokenURI(uint256 tokenId, INounsSeeder.Seed memory seed) external view override returns (string memory) {
        if (isDataURIEnabled) {
            return dataURI(tokenId, seed);
        }
        return string(abi.encodePacked(baseURI, tokenId.toString()));
    }

    /**
     * @notice Given a token ID and seed, construct a base64 encoded data URI for an official Nouns DAO noun.
     */
    function dataURI(uint256 tokenId, INounsSeeder.Seed memory seed) public view override returns (string memory) {
        string memory nounId = tokenId.toString();
        string memory name = string(abi.encodePacked('MATH Hat ', nounId));
        string memory description = string(abi.encodePacked('MATH Hat ', nounId, ' is a member of the FWD_DAO'));

        return genericDataURI(name, description, seed);
    }

    /**
     * @notice Given a name, description, and seed, construct a base64 encoded data URI.
     */
    function genericDataURI(
        string memory name,
        string memory description,
        INounsSeeder.Seed memory seed
    ) public view override returns (string memory) {
        NFTDescriptor.TokenURIParams memory params = NFTDescriptor.TokenURIParams({
            name: name,
            description: description,
            parts: _getPartsForSeed(seed),
            artstyle: backgrounds[seed.artstyle]
        });
        return NFTDescriptor.constructTokenURI(params, palettes);
    }

    /**
     * @notice Given a seed, construct a base64 encoded SVG image.
     */
    function generateSVGImage(INounsSeeder.Seed memory seed) external view override returns (string memory) {
        MultiPartRLEToSVG.SVGParams memory params = MultiPartRLEToSVG.SVGParams({
            parts: _getPartsForSeed(seed),
            background: backgrounds[seed.background]
        });
        return NFTDescriptor.generateSVGImage(params, palettes);
    }

    /**
     * @notice Add a single color to a color palette.
     */
    function _addColorToPalette(uint8 _paletteIndex, string calldata _color) internal {
        palettes[_paletteIndex].push(_color);
    }

    /**
     * @notice Add a Noun background.
     */
    function _addBackground(bytes calldata _background) internal {
        backgrounds.push(_background);
    }

    /**
     * @notice Add a Noun body.
     */
    function _addBaseColor(bytes calldata _basecolor) internal {
        basecolors.push(_basecolor);
    }

    /**
     * @notice Add a Noun head.
     */
    function _addVisor(bytes calldata _visor) internal {
        visors.push(_visor);
    }

    /**
     * @notice Add Noun mathletters.
     */
    function _addmathletters(bytes calldata _mathletters) internal {
        mathletters.push(_mathletters);
    }

    /**
     * @notice Add a Noun accessory.
     */
    function _addAccessory(bytes calldata _accessory) internal {
        accessories.push(_accessory);
    }

    /**
     * @notice Add MATH Hat Flair
     */
     function _addFlair(bytes calldata _flair) internal {
        flair.push(_flair);
     }

    /**
     * @notice Get all Noun parts for the passed `seed`.
     */
    function _getPartsForSeed(INounsSeeder.Seed memory seed) internal view returns (bytes[] memory) {
        bytes[] memory _parts = new bytes[](5);
        _parts[0] = backgrounds[seed.background];
        _parts[1] = basecolors[seed.basecolor];
        _parts[2] = visors[seed.visor];
        _parts[3] = mathletters[seed.mathletters];
        _parts[4] = accessories[seed.accessory];
        _parts[5] = flair[seed.flair];
        return _parts;
    }
}
