// SPDX-License-Identifier: GPL-3.0

/// @title A library used to construct ERC721 token URIs and SVG images

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

import { Base64 } from 'base64-sol/base64.sol';
import { INounsSeeder } from '../interfaces/INounsSeeder.sol';
import { INounsDescriptor } from '../interfaces/INounsDescriptor.sol';

library NFTDescriptor {
    struct TokenURIParams {
        string name;
        string description;
        bytes[] parts;
        string artstyle;
    }

        struct SVGParams {
        bytes[] parts;
        string artstyle;
    }

    string internal constant HEADER =
        '<svg id="hat" width="100%" height="100%" version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    string internal constant FOOTER =
        "<style>#hat{shape-rendering: crispedges; image-rendering: -webkit-crisp-edges; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;}</style></svg>";

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(TokenURIParams memory params, mapping(uint8 => string[]) storage palettes)
        public
        view
        returns (string memory)
    {
        string memory image = generateSVGImage(
            SVGParams({ parts: params.parts, artstyle: params.artstyle }),
            palettes
        );

        // prettier-ignore
        return string(
            abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked('{"name":"', params.name, '", "description":"', params.description, '", "image": "', 'data:image/svg+xml;base64,', image, '"}')
                    )
                )
            )
        );
    }

   /**
     * @notice Given a seed, construct a base64 encoded SVG image.
     */
    function generateSVGImage(INounsSeeder.Seed memory seed) public view override returns (string memory) {

        bytes[] memory parts = _getPartsForSeed(seed);


        string memory svg = Base64.encode(
            bytes(
                abi.encodePacked(
                    HEADER,
                    wrapTag(getBackgroundString(parts[0])),
                    wrapTag(getBaseColorString(parts[1])),
                    wrapTag(getVisorString(parts[2])),
                    wrapTag(getMATHLetterString(parts[3])),
                    wrapTag(getAccessoryString(parts[4])),
                    wrapTag(getFlairString(parts[5]))
                )
            )
        );
        return svg;
    }

    /**
     * @notice Get all Noun parts for the passed `seed`.
     */
    function _getPartsForSeed(INounsSeeder.Seed memory seed) internal view returns (bytes[] memory) {
        bytes[] memory _parts = new bytes[](5);
        _parts[0] = INounsDescriptor.backgrounds[seed.background];
        _parts[1] = INounsDescriptor.basecolors[seed.basecolor];
        _parts[2] = INounsDescriptor.visors[seed.visor];
        _parts[3] = INounsDescriptor.mathletters[seed.mathletters];
        _parts[4] = INounsDescriptor.accessories[seed.accessory];
        _parts[5] = INounsDescriptor.flair[seed.flair];
        return _parts;
    }

        function wrapTag(string memory uri) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<image x="1" y="1" width="500" height="500" image-rendering="pixelated" preserveAspectRatio="xMidYMid" xlink:href="data:image/png;base64,',
                    uri,
                    '"/>'
                )
            );
    }    

    /**
     * @notice Get a background string.
     * @param _index - the index of the stored bytes
     * @return - base64-encoded string for background image
     */
    function getBackgroundString(uint16 _index)
        internal
        view
        returns (string memory)
    {
        bytes memory componentBytes = INounsDescriptor.backgrounds(_index);
        string memory componentString = Base64.encode(componentBytes);
        return componentString;
    }

    /**
     * @notice Get a basecolor string.
     * @param _index - the index of the stored bytes
     * @return - base64-encoded string for base color image
     */
    function getBaseColorString(uint16 _index)
        internal
        view
        returns (string memory)
    {
        bytes memory componentBytes = INounsDescriptor.basecolors(_index);
        string memory componentString = Base64.encode(componentBytes);
        return componentString;
    }

    /**
     * @notice Get a visor string.
     * @param _index - the index of the stored bytes
     * @return - base64-encoded string for visor image
     */
    function getVisorString(uint16 _index)
        internal
        view
        returns (string memory)
    {
        bytes memory componentBytes = INounsDescriptor.visors(_index);
        string memory componentString = Base64.encode(componentBytes);
        return componentString;
    }

    /**
     * @notice Get a MATH letters string.
     * @param _index - the index of the stored bytes
     * @return - base64-encoded string for MATH letters image
     */
    function getMATHLetterString(uint16 _index)
        internal
        view
        returns (string memory)
    {
        bytes memory componentBytes = INounsDescriptor.mathletters(_index);
        string memory componentString = Base64.encode(componentBytes);
        return componentString;
    }    
}
