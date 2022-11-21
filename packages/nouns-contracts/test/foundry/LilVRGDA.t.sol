// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import { Test } from 'forge-std/Test.sol';
import { console } from 'forge-std/console.sol';
import { LilVRGDA } from '../../contracts/LilVRGDA.sol';
import { IProxyRegistry } from '../../contracts/external/opensea/IProxyRegistry.sol';
import { NounsDescriptor } from '../../contracts/NounsDescriptor.sol';
import { NounsSeeder } from '../../contracts/NounsSeeder.sol';
import { INounsSeeder } from '../../contracts/interfaces/INounsSeeder.sol';
import { NounsToken } from '../../contracts/NounsToken.sol';
import { WETH } from '../../contracts/test/WETH.sol';

// MockWETHReceiver can call settleAuction,
// but does not support receiving ether (for refunds)
// so it must use WETH fallback
contract MockWETHReceiver {
    LilVRGDA internal immutable vrgda;

    constructor(address _lilVRGDAAddress) {
        vrgda = LilVRGDA(_lilVRGDAAddress);
    }

    function callSettleAuction(uint256 expectedNounId, bytes32 expectedParentBlockhash) external payable {
        vrgda.settleAuction{ value: msg.value }(expectedNounId, expectedParentBlockhash);
    }
}

contract LilVRGDATestUtils is Test {
    IProxyRegistry proxyRegistry;
    NounsToken nounsToken;
    LilVRGDA vrgda;
    NounsDescriptor descriptor;
    WETH weth;

    address noundersDAOAddress = address(1); // Used by NounsToken
    address nounsDAOAddress = address(2); // nounsDAOAddress is set as owner of LilVRGDA

    /* Utils */

    // Taken from nouns-monorepo
    function readFile(string memory filepath) internal returns (bytes memory output) {
        string[] memory inputs = new string[](2);
        inputs[0] = 'cat';
        inputs[1] = filepath;
        output = vm.ffi(inputs);
    }

    function deploy(
        int256 _targetPrice,
        int256 _priceDecayPercent,
        int256 _perTimeUnit,
        uint256 _nextNounId, // Used for pricing
        uint256 _startTime,
        uint256 _reservePrice
    ) public {
        address oldMinterAddress = address(3); // TODO
        address proxyRegistryAddress = address(11);

        proxyRegistry = IProxyRegistry(proxyRegistryAddress);
        descriptor = new NounsDescriptor();
        nounsToken = new NounsToken(
            noundersDAOAddress,
            nounsDAOAddress,
            oldMinterAddress,
            descriptor,
            new NounsSeeder(),
            proxyRegistry
        );
        weth = new WETH();

        vrgda = new LilVRGDA(
            _targetPrice,
            _priceDecayPercent,
            _perTimeUnit,
            _nextNounId,
            _startTime,
            address(nounsToken),
            address(weth),
            _reservePrice
        );
        nounsToken.setMinter(address(vrgda));
        vrgda.transferOwnership(nounsDAOAddress);
        // vm.prank(address(this));
    }

    // This function is taken from https://github.com/nounsDAO/nouns-monorepo/blob/0c15de7071e1b95b6a542396d345a53b19f86e22/packages/nouns-contracts/test/foundry/helpers/DescriptorHelpers.sol#L14
    function populateDescriptor() public {
        // created with `npx hardhat descriptor-v1-export-abi`
        // string memory filename = './test/foundry/files/descriptor_v1/image-data.abi';
        string memory filename = './test/foundry/files/descriptor_v1/image-data.abi';
        bytes memory content = readFile(filename);
        (
            string[] memory bgcolors,
            string[] memory palette,
            bytes[] memory bodies,
            bytes[] memory accessories,
            bytes[] memory heads,
            bytes[] memory glasses
        ) = abi.decode(content, (string[], string[], bytes[], bytes[], bytes[], bytes[]));

        descriptor.addManyBackgrounds(bgcolors);
        descriptor.addManyColorsToPalette(0, palette);
        descriptor.addManyBodies(bodies);
        descriptor.addManyAccessories(accessories);
        descriptor.addManyHeads(heads);
        descriptor.addManyGlasses(glasses);
    }
}

contract LilVRGDATest is LilVRGDATestUtils {
    uint256 targetPrice = 0.15e18;

    function setUp() public {
        deploy(
            int256(targetPrice), // Target price.
            0.31e18, // Price decay percent.
            24 * 4 * 1e18, // Per time unit.
            0, // ID of the noun last sold
            block.timestamp, // auction start time
            0 // reservePrice
        );
        populateDescriptor();

        // Set block.timestamp to something ahead of vrgda.startTime()
        vm.warp(vrgda.startTime() + 1 days);
    }

    receive() external payable {}

    function testSettleAuction() public {
        uint256 initialNextNounId = vrgda.nextNounId();
        uint256 initialBalance = address(this).balance;

        // Caller should own no nouns at start.
        assertEq(nounsToken.balanceOf(address(this)), 0);
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();

        vm.expectEmit(false, true, true, true); // TODO not sure if this is working as expected
        vrgda.settleAuction{ value: price }(nounId, hash);

        // A noun should have been minted to nounders
        assertEq(nounsToken.ownerOf(initialNextNounId), noundersDAOAddress);
        // A noun should have been minted to the DAO
        assertEq(nounsToken.ownerOf(initialNextNounId + 1), nounsDAOAddress);
        // A noun should have been minted to caller that settled the auction
        assertEq(nounsToken.balanceOf(address(this)), 1);
        assertEq(nounsToken.ownerOf(initialNextNounId + 2), address(this));
        assertEq(initialNextNounId + 2, nounId);

        // VRGDA contract should nextNounId to reflect the 3 sales
        assertEq(vrgda.nextNounId(), initialNextNounId + 3);

        // Value equal to the auction price should be transferred to DAO
        assertEq(nounsDAOAddress.balance, price);
        assertEq(weth.balanceOf(nounsDAOAddress), 0);

        // Value equal to the auction price should be transferred to DAO
        assertEq(address(vrgda).balance, 0);
        assertEq(weth.balanceOf(address(vrgda)), 0);

        assertEq(address(this).balance, initialBalance - price);
        assertEq(weth.balanceOf(address(this)), 0);

        // Attempts to mint the same noun this block should fail
        vm.expectRevert('Invalid or expired nounId');
        vrgda.settleAuction(nounId, hash);

        // However, attempts to mint using the next ID with the same hash should pass 👀
        (uint256 newNounId, , , uint256 newPrice, ) = vrgda.fetchNextNoun(); // Fetch updated NounId and price after earlier sale
        assertEq(newNounId, nounId + 1);
        assertGt(newPrice, price);
        vrgda.settleAuction{ value: newPrice }(newNounId, hash); // Note: hash unchanged
    }

    function testSettleAuctionOverageRefund() public {
        uint256 initialBalance = address(this).balance;
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();
        assertGt(price, 0);
        uint256 overage = 1 ether;
        vrgda.settleAuction{ value: price + overage }(nounId, hash);
        assertEq(nounsToken.ownerOf(nounId), address(this));

        // Value equal to the auction price should be transferred to DAO
        assertEq(nounsDAOAddress.balance, price);
        assertEq(weth.balanceOf(nounsDAOAddress), 0);

        // Value equal to the auction price should be transferred to DAO
        assertEq(address(vrgda).balance, 0);
        assertEq(weth.balanceOf(address(vrgda)), 0);

        // Overage should be refunded back to caller
        assertEq(address(this).balance, initialBalance - price);
        assertEq(weth.balanceOf(address(this)), 0);
    }

    function testSettleAuctionOverageRefundWETH() public {
        MockWETHReceiver wethReceiver = new MockWETHReceiver(address(vrgda));
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();

        uint256 overage = 1 ether;
        wethReceiver.callSettleAuction{ value: price + overage }(nounId, hash);
        assertEq(address(wethReceiver).balance, 0);
        assertEq(weth.balanceOf(address(wethReceiver)), overage);
    }

    function testSettleAuctionExpiredBlockhash() public {
        (uint256 nounId, , , uint256 price, ) = vrgda.fetchNextNoun();

        // Should revert if incorrect blockhash supplied
        vm.expectRevert('Invalid or expired blockhash');
        vrgda.settleAuction{ value: price }(nounId, keccak256(unicode'⌐◨-◨ '));
    }

    function testSettleAuctionExpiredNounId() public {
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();

        // Should revert if incorrect nounId supplied
        vm.expectRevert('Invalid or expired nounId');
        vrgda.settleAuction{ value: price }(nounId + 1, hash);
    }

    function testSettleAuctionInsufficientFunds() public {
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();

        // Should revert if value supplied is lower than VRGDA price
        vm.expectRevert('Insufficient funds');
        vrgda.settleAuction{ value: price - 1 }(nounId, hash);
    }

    function testReservePrice() public {
        uint256 reservePrice = 1 ether;
        vm.prank(nounsDAOAddress); // Call as owner
        vrgda.setReservePrice(reservePrice);
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();

        // Only the owner should be able to set reservePrice
        vm.prank(address(999));
        vm.expectRevert('Ownable: caller is not the owner');
        vrgda.setReservePrice(reservePrice);

        // Should revert if supplied price is not high enough
        vm.prank(address(this));
        vm.expectRevert('Below reservePrice');
        assertGt(reservePrice, price);
        vrgda.settleAuction{ value: price }(nounId, hash);

        // Should be able to settle the auction once reserve price is lowered
        vm.prank(nounsDAOAddress); // Call as owner
        vrgda.setReservePrice(price);
        vrgda.settleAuction{ value: price }(nounId, hash);
    }

    function testPause() public {
        // Contract should not be paused to start
        assertFalse(vrgda.paused());

        // Non owners can't pause
        vm.prank(address(999));
        vm.expectRevert('Ownable: caller is not the owner');
        vrgda.pause();

        // Owner can pause
        vm.prank(nounsDAOAddress);
        vrgda.pause();

        // settleAuction should fail if paused
        (uint256 nounId, , , uint256 price, bytes32 hash) = vrgda.fetchNextNoun();
        vm.expectRevert('Pausable: paused');
        vrgda.settleAuction{ value: price }(nounId, hash);
    }

    // function testFetchNextNoun() public {} // TODO in fork test
    // TODO test reentrancy vector

    function testRejectsEther() public {
        // VRGDA contract should transactions with ether value with calldata sent to fallback
        vm.expectRevert('Revert');
        (bool sent, ) = payable(address(vrgda)).call{ value: 1 ether }('calldata');
        assertFalse(sent);

        // VRGDA contract should transactions with ether value and no calldata sent to fallback
        vm.expectRevert('revert');
        (sent, ) = payable(address(vrgda)).call{ value: 1 ether }(new bytes(0));
        assertFalse(sent);
        // TODO document why these cases are different
    }

    function testVRGDAPricing() public {
        // The rest of the test relies on this assumption
        assertGt(vrgda.updateInterval(), 1 seconds);

        vm.warp(vrgda.startTime());
        uint256 initialPrice = vrgda.getCurrentVRGDAPrice();
        // Price should be higher than target at first, until 1 full time interval
        // has passed
        assertGt(initialPrice, targetPrice);

        // Price should stay the same for the entire interval
        vm.warp(vrgda.startTime() + vrgda.updateInterval() - 1 seconds);
        uint256 priceOneSecondBeforeUpdate = vrgda.getCurrentVRGDAPrice();
        assertEq(initialPrice, priceOneSecondBeforeUpdate);

        // Price should update at and after the update interval
        vm.warp(vrgda.startTime() + vrgda.updateInterval());
        uint256 priceAtUpdate = vrgda.getCurrentVRGDAPrice();
        vm.warp(vrgda.startTime() + vrgda.updateInterval() + 1 seconds);
        uint256 priceOneSecondAfterUpdate = vrgda.getCurrentVRGDAPrice();
        assertEq(priceAtUpdate, priceOneSecondAfterUpdate);
        assertGt(priceOneSecondBeforeUpdate, priceAtUpdate);

        // At the first interval price should be target price (assuming no sales)
        assertEq(targetPrice, priceAtUpdate);
    }
}

