// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
UUPS Upgradeable Pattern Demo
Maps to syllabus: Advanced Contract Patterns -> Upgradeable contract patterns (UUPS)

This file contains:
- BoxV1Upgradeable: initial implementation with initialize() and basic storage
- BoxV2Upgradeable: upgraded implementation adding new functionality (increment)
- UUPS authorization implemented via onlyOwner

Requirements (Hardhat):
  npm i --save-dev @openzeppelin/contracts-upgradeable @openzeppelin/hardhat-upgrades @nomicfoundation/hardhat-toolbox
  // and enable the plugin by requiring '@openzeppelin/hardhat-upgrades' in hardhat.config.js

Important rules for upgrades:
- Never change the order or type of existing storage variables
- You may append new state variables at the end in V2/V3...
- Constructors are not used; use initialize() and reinitializer() instead
- Always protect _authorizeUpgrade with access control (e.g., onlyOwner)

Quick deploy/upgrade script (example):
------------------------------------------------------------
// scripts/deploy-uups.js
const { ethers, upgrades } = require("hardhat");
async function main() {
  const BoxV1 = await ethers.getContractFactory("BoxV1Upgradeable");
  const box = await upgrades.deployProxy(BoxV1, [42n], {
    kind: "uups",
    initializer: "initialize",
  });
  await box.waitForDeployment();
  console.log("UUPS proxy deployed at:", await box.getAddress());
}
main().catch((e) => { console.error(e); process.exit(1); });

// scripts/upgrade-uups.js
const { ethers, upgrades } = require("hardhat");
async function main() {
  const proxyAddress = process.env.PROXY_ADDRESS; // set to your deployed proxy
  const BoxV2 = await ethers.getContractFactory("BoxV2Upgradeable");
  const upgraded = await upgrades.upgradeProxy(proxyAddress, BoxV2);
  await upgraded.waitForDeployment();
  console.log("Upgraded proxy at:", await upgraded.getAddress());
}
main().catch((e) => { console.error(e); process.exit(1); });
------------------------------------------------------------
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
        __Ownable_init(msg.sender); // OZ v5: pass initial owner
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
        // read via public view in parent is not internal; we keep _value private in V1
        // so we provide an internal getter via assembly or change V1 visibility in real projects.
        // For teaching, we re-store using retrieve() to compute next value.
        uint256 current = this.retrieve();
        store(current + 1);
    }

    function version() external pure override returns (string memory) {
        return "V2";
    }
}

/*
Testing tips:
- Deploy V1 as a UUPS proxy using deployProxy with kind: 'uups'
- Interact with proxy to read/write value
- Upgrade proxy to V2 using upgradeProxy and confirm new functionality works
- Verify storage is preserved across upgrades (retrieve() returns same value post-upgrade)

Security:
- Carefully review storage layout changes between versions
- Restrict upgradeability with multi-sig or timelock in production (instead of EOA owner)
- Consider using OpenZeppelin Defender for upgrade proposals and review workflows
*/