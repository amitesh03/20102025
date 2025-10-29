// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MyToken - OpenZeppelin ERC20 for Truffle lesson
/// @notice Demonstrates ERC20 basics, constructor mint, and owner-only minting
contract MyToken is ERC20, Ownable {
    /// @notice Deploy token and mint initial supply to the deployer
    /// @param name_ Token name
    /// @param symbol_ Token symbol
    /// @param initialSupply Initial supply in wei units (consider 18 decimals)
    constructor(string memory name_, string memory symbol_, uint256 initialSupply)
        ERC20(name_, symbol_)
        Ownable(msg.sender)
    {
        _mint(msg.sender, initialSupply);
    }

    /// @notice Mint new tokens to an address (owner only)
    /// @param to Recipient address
    /// @param amount Amount to mint (wei units)
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}