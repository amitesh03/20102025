// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
BoxUpgradeable contracts for UUPS pattern within the Hardhat project.
These mirror the examples in:
- [`lessons/advanced/patterns/UUPSProxy.sol`](lessons/advanced/patterns/UUPSProxy.sol)

Used by scripts:
- [`lessons/intermediate/hardhat/scripts/deploy-uups.js`](lessons/intermediate/hardhat/scripts/deploy-uups.js)
- [`lessons/intermediate/hardhat/scripts/upgrade-uups.js`](lessons/intermediate/hardhat/scripts/upgrade-uups.js)

Requirements:
  npm i --save-dev @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades
  And in hardhat.config.js:
    require("@openzeppelin/hardhat-upgrades");
*/

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/// @title BoxV1Upgradeable - UUPS initial implementation
contract BoxV1Upgradeable is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    // STORAGE LAYOUT (do not change order/types in future versions)
    uint256 private _value;

    event ValueChanged(uint256 newValue);

    // Initializer replaces constructor in upgradeable contracts
    function initialize(uint256 initialValue) public initializer {
        __UUPSUpgradeable_init();
        __Ownable_init(msg.sender); // OZ v5: set initial owner
        _value = initialValue;
        emit ValueChanged(initialValue);
    }

    function store(uint256 newValue) external onlyOwner {
        _value = newValue;
        emit ValueChanged(newValue);
    }

    function retrieve() external view returns (uint256) {
        return _value;
    }

    // UUPS upgrade authorization
    function _authorizeUpgrade(address /*newImplementation*/ ) internal override onlyOwner {}

    // Optional: version helper
    function version() external pure virtual returns (string memory) {
        return "V1";
    }
}

/// @title BoxV2Upgradeable - UUPS upgraded implementation adding features
/// @dev Must keep storage layout compatible with V1 (append-only)
contract BoxV2Upgradeable is BoxV1Upgradeable {
    // APPEND NEW STATE HERE IF NEEDED
    // uint256 private _extra; // example (ensure to only append)

    // Example new function
    function increment() external onlyOwner {
        // Since _value is private in V1, we read via the external view retrieve()
        uint256 current = this.retrieve();
        store(current + 1);
    }

    function version() external pure override returns (string memory) {
        return "V2";
    }
}