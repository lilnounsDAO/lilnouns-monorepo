// SPDX-License-Identifier: GPL-3.0

/// @title A library used to convert multi-part RLE compressed images to SVG

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

library MultiPartRLEToSVG {
    struct SVGParams {
        bytes[] parts;
        string artstyle;
    }

    string internal constant HEADER =
        '<svg id="hat" width="100%" height="100%" version="1.1" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
    string internal constant FOOTER =
        "<style>#hat{shape-rendering: crispedges; image-rendering: -webkit-crisp-edges; image-rendering: -moz-crisp-edges; image-rendering: crisp-edges; -ms-interpolation-mode: nearest-neighbor;}</style></svg>";

    /**
     * @notice Given RLE image parts and color palettes, merge to generate a single SVG image.
     */
    function generateSVG(SVGParams memory params, mapping(uint8 => string[]) storage )
        internal
        view
        returns (string memory svg)
    {
        // prettier-ignore
        return string(
            abi.encodePacked(
                    HEADER,
                    wrapTag(getBaseColorString(params.parts)),
                    wrapTag(getFlairString(_flair)),
                    FOOTER
            )
        );
    }

    /**
     * @notice Get a background string.
     * @param _index - the index of the stored background bytes
     * @return - base64-encoded string for base color image
     */
    function getBaseColorString(uint16 _index)
        internal
        view
        returns (string memory)
    {
        bytes memory componentBytes = basecolors[_index];
        string memory componentString = SVGGen.getBase64(componentBytes);
        return componentString;
    }

    /**
     * @notice Get a flair string.
     * @param _index - the index of the stored background bytes
     * @return - base64-encoded string for flair image
     */
    function getFlairString(uint16 _index)
        internal
        view
        returns (string memory)
    {
        bytes memory componentBytes = flair[_index];
        string memory componentString = SVGGen.getBase64(componentBytes);
        return componentString;
    }
    /**
     * @notice Wraps a given string in XML tags.
     * @param uri - the base64 string of a for a component
     * @return - given uri but warpped in the XML tags
     */
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
}
