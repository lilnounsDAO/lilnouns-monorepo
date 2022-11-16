// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

import "forge-std/Test.sol";
import { NounsToken } from "../../contracts/NounsToken.sol";
import { NounsDescriptorV2 } from "../../contracts/NounsDescriptorV2.sol";
import { NounsSeeder } from "../../contracts/NounsSeeder.sol";
import { IProxyRegistry } from "../../contracts/external/opensea/IProxyRegistry.sol";
import { SVGRenderer } from "../../contracts/SVGRenderer.sol";
import { NounsArt } from "../../contracts/NounsArt.sol";
import { DeployUtils } from "./helpers/DeployUtils.sol";

contract NounsTokenTest is Test, DeployUtils {
  NounsToken nounsToken;
  address lilnoundersDAO = address(1);
  address nounsDAO = address(2);
  address minter = address(3);

  function setUp() public {
    NounsDescriptorV2 descriptor = _deployAndPopulateV2();
    _populateDescriptorV2(descriptor);

    nounsToken = new NounsToken(
      lilnoundersDAO,
      nounsDAO,
      minter,
      descriptor,
      new NounsSeeder(),
      IProxyRegistry(address(0))
    );
  }

  function testSymbol() public {
    assertEq(nounsToken.symbol(), "LILNOUN");
  }

  function testName() public {
    assertEq(nounsToken.name(), "Lil Nouns");
  }

  function testMintANounToSelfAndRewardsLilNoundersDao() public {
    vm.prank(minter);
    nounsToken.mint();

    assertEq(nounsToken.ownerOf(0), lilnoundersDAO);
    assertEq(nounsToken.ownerOf(1), nounsDAO);
    assertEq(nounsToken.ownerOf(2), minter);
  }

  function testRevertsOnNotMinterMint() public {
    vm.expectRevert("Sender is not the minter");
    nounsToken.mint();
  }
}
