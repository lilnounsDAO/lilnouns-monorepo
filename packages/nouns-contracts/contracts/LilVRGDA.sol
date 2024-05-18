// SPDX-License-Identifier: GPL-3.0

/// @title The Lil Nouns DAO VRGDA

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

import { LinearVRGDA } from './vrgda/LinearVRGDA.sol';

import { PausableUpgradeable } from '@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol';
import { ReentrancyGuardUpgradeable } from '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import { OwnableUpgradeable } from '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';

import { UUPS } from './proxies/UUPS.sol';

import { toDaysWadUnsafe } from 'solmate/src/utils/SignedWadMath.sol';
import { INounsSeederV2 } from './interfaces/INounsSeederV2.sol';
import { INounsToken } from './interfaces/INounsToken.sol';
import { INounsDescriptorV2 } from './interfaces/INounsDescriptorV2.sol';
import { ILilVRGDA } from './interfaces/ILilVRGDA.sol';
import { IWETH } from './interfaces/IWETH.sol';
import { IERC20 } from '@openzeppelin/contracts/token/ERC20/IERC20.sol';

contract LilVRGDA is ILilVRGDA, LinearVRGDA, PausableUpgradeable, ReentrancyGuardUpgradeable, OwnableUpgradeable, UUPS {
    // The very next nounID that will be minted on auction,
    // equal to total number sold + 1
    uint256 public nextNounId;

    // How often the VRGDA price will update to reflect VRGDA pricing rules
    uint256 public updateInterval = 15 minutes;

    // Time of sale of the first lilNoun, used to calculate VRGDA price
    uint256 public startTime;

    // The minimum price accepted in an auction
    uint256 public reservePrice;

    // The size of the pool of tokens you can choose to buy from
    uint256 public poolSize;

    // Mapping of blockNumbers that have been used to mint tokens
    mapping(uint256 blockNumber => bool used) public usedBlockNumbers;

    // The WETH contract address
    address public immutable wethAddress;

    // The Nouns ERC721 token contract
    INounsToken public nounsToken;

    // The Nouns Seeder contract
    INounsSeederV2 public nounsSeeder;

    // The Nouns Descriptor contract
    INounsDescriptorV2 public nounsDescriptor;

    // Nouns sold so far
    uint256 public nounsSoldAtAuction;

    // Nouns minted for the Lil Nounders as rewards so far
    uint256 public lilNounderRewardNouns;

    // Nouns minted for Nouns DAO as rewards so far
    uint256 public nounsDAORewardNouns;

    // The expected block number for the next noun
    uint256 public seederBlockNumber;

    ///                                            ///
    ///                   ERRORS                   ///
    ///                                            ///

    // Reverts when the address is zero
    error ADDRESS_ZERO();

    ///                                            ///
    ///                CONSTRUCTOR                 ///
    ///                                            ///

    /**
     * @notice Creates a new LilVRGDA contract instance.
     * @dev Initializes the LinearVRGDA with pricing parameters.
     * @param _targetPrice The target price for a token if sold on pace, scaled by 1e18.
     * @param _priceDecayPercent The percent price decays per unit of time with no sales, scaled by 1e18.
     * @param _perTimeUnit The number of tokens to target selling in 1 full unit of time, scaled by 1e18.
     * @param _wethAddress The address of the WETH contract
     */
    constructor(
        int256 _targetPrice,
        int256 _priceDecayPercent,
        int256 _perTimeUnit,
        address _wethAddress
    ) LinearVRGDA(_targetPrice, _priceDecayPercent, _perTimeUnit) {
        wethAddress = _wethAddress;

        if (_wethAddress == address(0)) revert ADDRESS_ZERO();
    }

    /**
     * @notice Initializes a token's metadata descriptor

     * @param _reservePrice The reserve price for the auction
     * @param _nextNounId The next noun ID to be minted
     * @param _poolSize The size of the pool of tokens you can choose to buy from
     * @param _nounsSoldAtAuction The number of nouns sold so far.
     * @param _nounsTokenAddress The address of the token contract
     * @param _nounsSeederAddress The address of the seeder contract
     * @param _nounsDescriptorAddress The address of the descriptor contract
     */
    function initialize(
        uint256 _reservePrice,
        uint256 _nextNounId,
        uint256 _poolSize,
        uint256 _nounsSoldAtAuction,
        address _nounsTokenAddress,
        address _nounsSeederAddress,
        address _nounsDescriptorAddress
    ) external initializer {
        if (_nounsTokenAddress == address(0)) revert ADDRESS_ZERO();
        if (_nounsSeederAddress == address(0)) revert ADDRESS_ZERO();
        if (_nounsDescriptorAddress == address(0)) revert ADDRESS_ZERO();

        // Setup ownable
        __Ownable_init(); // sets owner to msg.sender
        // Setup reentrancy guard
        __ReentrancyGuard_init();
        // Setup pausable
        __Pausable_init();

        nextNounId = _nextNounId;

        // If we are upgrading, don't reset the start time
        if (startTime == 0) startTime = block.timestamp;

        reservePrice = _reservePrice;
        poolSize = _poolSize;
        nounsSoldAtAuction = _nounsSoldAtAuction;

        // set contracts
        nounsToken = INounsToken(_nounsTokenAddress);
        nounsSeeder = INounsSeederV2(_nounsSeederAddress);
        nounsDescriptor = INounsDescriptorV2(_nounsDescriptorAddress);
    }

    /**
     * @notice Allows a user to buy a Noun immediately at the current VRGDA price if conditions are met.
     * @param expectedBlockNumber The block number to specify the traits of the token
     * @param expectedNounId The expected noun ID to be minted
     * @dev This function is payable and requires the sent value to be at least the reserve price and the current VRGDA price.
     * It checks if the block number is valid, mints the Noun, transfers it, handles refunds, and sends funds to the DAO.
     */
    function buyNow(
        uint256 expectedBlockNumber,
        uint256 expectedNounId
    ) external payable override whenNotPaused nonReentrant {
        // mint tokens from nouns from the last n blocks
        require(
            expectedBlockNumber <= block.number - 1 &&
                usedBlockNumbers[expectedBlockNumber] == false &&
                expectedBlockNumber >= block.number - poolSize,
            'Invalid block number'
        );

        uint256 _nextNounIdForCaller = nextNounId;

        // Enforce minting expected NounId
        require(expectedNounId == _nextNounIdForCaller, 'Invalid or expired nounId');

        // If going to mint Nouns that are founder rewards, increment the counts
        if (_nextNounIdForCaller <= 175300 && _nextNounIdForCaller % 10 == 0) {
            _nextNounIdForCaller++;
            lilNounderRewardNouns++;
        }
        if (_nextNounIdForCaller <= 175301 && _nextNounIdForCaller % 10 == 1) {
            _nextNounIdForCaller++;
            nounsDAORewardNouns++;
        }

        // make it impossible to get a token with traits of any previous token (pool is emptied when a noun is bought, prevents buying duplicates)
        usedBlockNumbers[expectedBlockNumber] = true;

        // store the expected block number for use in the seeder
        seederBlockNumber = expectedBlockNumber;

        // Validate the purchase request against the VRGDA rules.
        uint256 price = getVRGDAPrice(
            _nextNounIdForCaller - nounsSoldAtAuction - lilNounderRewardNouns - nounsDAORewardNouns
        );
        require(msg.value >= price, 'Insufficient funds');

        // Call settleAuction on the nouns contract.
        uint256 mintedNounId = nounsToken.mint();
        require(mintedNounId == _nextNounIdForCaller, 'Incorrect minted noun id');

        // Increment the next noun ID.
        nextNounId = mintedNounId + 1;

        // Sends token to caller.
        nounsToken.transferFrom(address(this), msg.sender, mintedNounId);

        // Sends the funds to the DAO.
        if (msg.value > 0) {
            uint256 refundAmount = msg.value - price;
            if (refundAmount > 0) {
                _safeTransferETHWithFallback(msg.sender, refundAmount);
            }
            if (price > 0) {
                _safeTransferETHWithFallback(owner(), price);
            }
        }

        emit AuctionSettled(mintedNounId, msg.sender, price);
    }

    /**
     * @notice Set the VRGDA reserve price.
     * @dev Only callable by the owner.
     */
    function setReservePrice(uint256 _reservePrice) external onlyOwner {
        reservePrice = _reservePrice;

        emit AuctionReservePriceUpdated(_reservePrice);
    }

    /**
     * @notice Get the block number used to seed the next noun.
     * @return The block number used to seed the next noun.
     */
    function getSeederBlockNumber() external view returns (uint256) {
        return seederBlockNumber;
    }

    /**
     * @notice Set the auction update interval.
     * @dev Only callable by the owner.
     */
    function setUpdateInterval(uint256 _updateInterval) external onlyOwner {
        updateInterval = _updateInterval;
        emit AuctionUpdateIntervalUpdated(_updateInterval);
    }

    /**
     * @notice Sets the pool size.
     * @dev Only callable by the owner.
     */
    function setPoolSize(uint256 _poolSize) external onlyOwner {
        poolSize = _poolSize;

        emit PoolSizeUpdated(_poolSize);
    }

    /**
     * @notice Pause the LilVRGDA auction.
     * @dev This function can only be called by the owner when the
     * contract is unpaused. No new Lils can be sold when paused.
     */
    function pause() external override onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the LilVRGDA auction.
     * @dev This function can only be called by the owner when the
     * contract is paused.
     */
    function unpause() external override onlyOwner {
        _unpause();
    }

    /**
     * @notice Fetches the next noun's details including ID, seed, SVG, price, and blockhash.
     * @param blockNumber The block number to use for generating the seed.
     * @dev Generates the seed and SVG for the next noun, calculates its price based on VRGDA rules, and fetches the blockhash.
     * @return nounId The ID of the next noun.
     * @return seed The seed data for generating the next noun's SVG.
     * @return svg The SVG image of the next noun.
     * @return price The price of the next noun according to VRGDA rules.
     * @return hash The blockhash associated with the next noun.
     */
    function fetchNoun(
        uint256 blockNumber
    )
        public
        view
        override
        returns (uint256 nounId, INounsSeederV2.Seed memory seed, string memory svg, uint256 price, bytes32 hash)
    {
        uint256 _nextNounIdForCaller = nextNounIdForCaller();
        // Generate the seed for the next noun.
        seed = nounsSeeder.generateSeedForBlock(_nextNounIdForCaller, nounsDescriptor, blockNumber);

        // Generate the SVG from seed using the descriptor.
        svg = nounsDescriptor.generateSVGImage(seed);

        // Calculate price based on VRGDA rules.
        price = getCurrentVRGDAPrice();

        // Fetch the blockhash associated with this noun.
        hash = blockhash(blockNumber);

        return (_nextNounIdForCaller, seed, svg, price, hash);
    }

    /**
     * @notice Fetches the next noun's details including ID, seed, SVG, price, and blockhash.
     * @dev Same as fetchNoun except for the next up Noun
     */
    function fetchNextNoun()
        external
        view
        override
        returns (uint256 nounId, INounsSeederV2.Seed memory seed, string memory svg, uint256 price, bytes32 hash)
    {
        return fetchNoun(block.number - 1);
    }

    /**
     * @notice Calculates the current price of a VRGDA token based on the time elapsed.
     * @return The current price of the next VRGDA token.
     */
    function getCurrentVRGDAPrice() public view returns (uint256) {
        return getVRGDAPrice(nextNounId - nounsSoldAtAuction - lilNounderRewardNouns - nounsDAORewardNouns);
    }

    /**
     * @notice Calculates the current price of a VRGDA token based on the time elapsed and the next noun ID.
     * @param numSold The number of nouns sold so far.
     * @dev This function computes the absolute time since the start of the auction, adjusts it to the nearest day, and then calculates the price using the VRGDA formula.
     * @return The current price of the next VRGDA token.
     */
    function getVRGDAPrice(uint256 numSold) internal view returns (uint256) {
        uint256 absoluteTimeSinceStart = block.timestamp - startTime; // Calculate the absolute time since the auction started.
        uint256 price = getVRGDAPrice(
            // Adjust time to the nearest day.
            toDaysWadUnsafe(absoluteTimeSinceStart - (absoluteTimeSinceStart % updateInterval)),
            // The number sold, not including the nouns sold at auction and reward Nouns.
            numSold
        );

        // return max of price and reservePrice
        return price > reservePrice ? price : reservePrice;
    }

    /**
     * @notice Fetches the next noun ID that will be minted to the caller.
     * @dev Handles edge cases in the nouns token contract for founders rewards.
     * @return nounId The ID of the next noun.
     */
    function nextNounIdForCaller() public view returns (uint256) {
        // Calculate nounId that would be minted to the caller
        uint256 _nextNounIdForCaller = nextNounId;
        if (_nextNounIdForCaller <= 175300 && _nextNounIdForCaller % 10 == 0) {
            _nextNounIdForCaller++;
        }
        if (_nextNounIdForCaller <= 175301 && _nextNounIdForCaller % 10 == 1) {
            _nextNounIdForCaller++;
        }
        return _nextNounIdForCaller;
    }

    /**
     * @notice Transfer ETH. If the ETH transfer fails, wrap the ETH and try send it as wethAddress.
     * @param _to The address to transfer ETH to.
     * @param _amount The amount of ETH to transfer.
     */
    function _safeTransferETHWithFallback(address _to, uint256 _amount) private {
        // Ensure the contract has enough ETH to transfer
        if (address(this).balance < _amount) revert('Insufficient balance');

        // Used to store if the transfer succeeded
        bool success;

        assembly {
            // Transfer ETH to the recipient
            // Limit the call to 30,000 gas
            success := call(30000, _to, _amount, 0, 0, 0, 0)
        }

        // If the transfer failed:
        if (!success) {
            // Wrap as WETH
            IWETH(wethAddress).deposit{ value: _amount }();

            // Transfer WETH instead
            bool wethSuccess = IWETH(wethAddress).transfer(_to, _amount);

            // Ensure successful transfer
            if (!wethSuccess) revert('WETH transfer failed');
        }
    }

    /**
     * @notice Ensures the caller is authorized to upgrade the contract to a new implementation.
     * @dev This function is invoked in the UUPS `upgradeTo` and `upgradeToAndCall` methods.
     * @param _impl Address of the new contract implementation.
     */
    function _authorizeUpgrade(address _impl) internal view override onlyOwner {}
}
