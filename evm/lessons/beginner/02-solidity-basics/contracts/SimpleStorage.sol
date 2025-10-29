// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title SimpleStorage - minimal example of state, events, modifiers, and custom errors
/// @author 
/// @notice Store and retrieve a single uint256, owner-restricted setter
/// @dev Uses Solidity ^0.8 overflow checks; demonstrates basic patterns
contract SimpleStorage {
    // ============ Storage ============
    uint256 private _value;
    address public owner;

    // ============ Events ============
    /// @notice Emitted when the stored value changes
    /// @param previous The previous stored value
    /// @param current The new stored value
    event ValueChanged(uint256 indexed previous, uint256 indexed current);

    /// @notice Emitted when ownership is transferred
    /// @param previousOwner The previous owner
    /// @param newOwner The new owner
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ============ Errors ============
    /// @notice Thrown when caller is not the owner
    error NotOwner();

    /// @notice Thrown when setting to the same value
    /// @param attempted The attempted value (equal to the existing one)
    error ValueUnchanged(uint256 attempted);

    // ============ Modifiers ============
    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // ============ Constructor ============
    constructor(uint256 initialValue) {
        owner = msg.sender;
        _value = initialValue;
        emit OwnershipTransferred(address(0), msg.sender);
        emit ValueChanged(0, initialValue);
    }

    // ============ External Functions ============
    /// @notice Set a new value (owner only)
    /// @param newValue The value to store
    function set(uint256 newValue) external onlyOwner {
        uint256 prev = _value;
        if (newValue == prev) revert ValueUnchanged(newValue);
        _value = newValue;
        emit ValueChanged(prev, newValue);
    }

    /// @notice Increment the value by delta (owner only)
    /// @param delta Amount to add (can be zero)
    /// @return newValue The updated value after increment
    function increment(uint256 delta) external onlyOwner returns (uint256 newValue) {
        uint256 prev = _value;
        newValue = prev + delta;
        _value = newValue;
        emit ValueChanged(prev, newValue);
    }

    /// @notice Transfer contract ownership to a new address
    /// @param newOwner The address of the new owner (must not be zero)
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "new owner is zero");
        address prev = owner;
        owner = newOwner;
        emit OwnershipTransferred(prev, newOwner);
    }

    /// @notice Renounce ownership (sets owner to the zero address)
    /// @dev After renouncing, onlyOwner functions will become unusable
    function renounceOwnership() external onlyOwner {
        address prev = owner;
        owner = address(0);
        emit OwnershipTransferred(prev, address(0));
    }

    // ============ View Functions ============
    /// @notice Read the currently stored value
    function get() external view returns (uint256) {
        return _value;
    }
}