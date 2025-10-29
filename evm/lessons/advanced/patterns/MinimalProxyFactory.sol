// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
Minimal Proxy Factory (EIP-1167 Clones)
Maps to syllabus: Advanced Contract Patterns -> Factory contracts, Gas optimization techniques

This lesson demonstrates:
- A base implementation contract (MinimalVault) without a constructor
- A factory that deploys cheap minimal proxies (clones) pointing to the implementation
- Deterministic addresses with CREATE2 (predictable proxy addresses)
- An initialize() function to configure each clone instance

Why Clones?
- Clones dramatically reduce deployment gas by reusing implementation code
- Each clone has its own storage, initialized via an external call
- Great for deploying many instances of the same logic (vaults, modules, accounts)

Install dependency (in a Hardhat project):
  npm i @openzeppelin/contracts

Then copy this file to your contracts/ directory and compile.

Usage outline (Hardhat console):
  const Impl = await ethers.getContractFactory("MinimalVault");
  const impl = await Impl.deploy(); await impl.waitForDeployment();

  const Factory = await ethers.getContractFactory("VaultFactory");
  const factory = await Factory.deploy(await impl.getAddress()); await factory.waitForDeployment();

  // optional: predict address before deploying
  const owner = (await ethers.getSigners())[0].address;
  const predicted = await factory.predictVault(owner, 1);

  // deploy a clone for the owner
  const tx = await factory.createVault(1);
  const rc = await tx.wait();
  // read user's vaults
  const vaults = await factory.getUserVaults(owner);

  // interact with the clone via MinimalVault ABI at 'predicted' or 'vaults[0]'

Security notes:
- initialize() can only be called once (guarded)
- ownership and sweep restricted to the owner
- do NOT send real funds on unreviewed code; this is educational
*/

import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

/// @title MinimalVault - Implementation logic to be cloned
/// @dev No constructor; use initialize() for per-clone setup
contract MinimalVault {
    address public owner;
    bool private _initialized;

    event Initialized(address indexed owner);
    event Received(address indexed from, uint256 amount);
    event Swept(address indexed to, uint256 amount);

    error AlreadyInitialized();
    error NotOwner();
    error ZeroAddress();
    error NothingToSweep();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /// @notice one-time initializer for clones
    function initialize(address _owner) external {
        if (_initialized) revert AlreadyInitialized();
        if (_owner == address(0)) revert ZeroAddress();
        owner = _owner;
        _initialized = true;
        emit Initialized(_owner);
    }

    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    /// @notice withdraw ETH from this vault to a recipient
    function sweep(address payable to, uint256 amount) external onlyOwner {
        if (to == address(0)) revert ZeroAddress();
        if (amount == 0 || amount > address(this).balance) revert NothingToSweep();
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "send failed");
        emit Swept(to, amount);
    }

    /// @notice convenience to withdraw full balance
    function sweepAll(address payable to) external onlyOwner {
        uint256 bal = address(this).balance;
        if (bal == 0) revert NothingToSweep();
        (bool ok, ) = to.call{value: bal}("");
        require(ok, "send failed");
        emit Swept(to, bal);
    }
}

/// @title VaultFactory - Deploys minimal proxies (clones) of MinimalVault
/// @dev Supports deterministic addresses using CREATE2 via salt
contract VaultFactory {
    using Clones for address;

    address public immutable implementation;

    // Track vaults created per owner
    mapping(address => address[]) private _vaultsOf;

    event VaultDeployed(address indexed owner, address proxy, bytes32 salt);

    error ZeroImplementation();

    constructor(address _implementation) {
        if (_implementation == address(0)) revert ZeroImplementation();
        implementation = _implementation;
    }

    /// @notice Create a new clone for msg.sender using a saltTag to get deterministic address
    /// @param saltTag arbitrary number used to derive the CREATE2 salt
    /// @return proxy address of the newly created clone
    function createVault(uint256 saltTag) external returns (address proxy) {
        bytes32 salt = _deriveSalt(msg.sender, saltTag);
        proxy = Clones.cloneDeterministic(implementation, salt);
        MinimalVault(payable(proxy)).initialize(msg.sender);
        _vaultsOf[msg.sender].push(proxy);
        emit VaultDeployed(msg.sender, proxy, salt);
    }

    /// @notice Predict the address of a vault before deploying
    function predictVault(address owner, uint256 saltTag) external view returns (address) {
        bytes32 salt = _deriveSalt(owner, saltTag);
        return Clones.predictDeterministicAddress(implementation, salt, address(this));
    }

    /// @notice Get all vaults deployed for an owner
    function getUserVaults(address owner) external view returns (address[] memory) {
        return _vaultsOf[owner];
    }

    function _deriveSalt(address owner, uint256 saltTag) internal pure returns (bytes32) {
        return keccak256(abi.encode(owner, saltTag));
    }
}

/*
Gas Optimization Highlights
- Minimal proxies (EIP-1167) drastically cut deployment gas vs full contracts
- Reuse logic from a single implementation; each clone only stores state
- Deterministic deployment lets you precompute addresses, simplifying frontends/integration
- Prefer errors (custom errors) over revert strings to save gas
- Tight external functions and no storage writes in read-only paths

Extensions
- Add ERC20/721 vault logic to store/move tokens
- Add role-based access control (RBAC) or multi-sig ownership
- Emit richer events to support indexers/analytics
*/