// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
Reentrancy Fixed Demo
Maps to syllabus: Security Best Practices -> Reentrancy protection

This contract shows two complementary fixes:
1) CEI (Checks-Effects-Interactions): update state before making external calls
2) ReentrancyGuard: prevent re-entrance into nonReentrant functions

Compare with the vulnerable example:
- See lessons/advanced/security/Reentrancy.sol
*/

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title SafeBank - fixed version using CEI + ReentrancyGuard
contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    /// @notice deposit ETH and increase internal balance
    function deposit() external payable {
        require(msg.value > 0, "no value");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    /// @notice withdraw entire balance safely
    /// Fixes:
    ///  - CEI: set balance to 0 BEFORE external call
    ///  - nonReentrant: prevents re-entry into this function
    function withdrawAll() external nonReentrant {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "nothing to withdraw");

        // Effects (state update) BEFORE interaction
        balances[msg.sender] = 0;

        // Interaction last: transfer ETH to user
        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "send failed");

        emit Withdraw(msg.sender, bal);
    }

    /// @notice withdraw to a specific recipient (demonstrates CEI pattern)
    function withdrawTo(address payable to, uint256 amount) external nonReentrant {
        require(to != address(0), "zero address");
        uint256 bal = balances[msg.sender];
        require(amount > 0 && amount <= bal, "insufficient");

        // Effects first
        balances[msg.sender] = bal - amount;

        // Interaction last
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "send failed");

        emit Withdraw(to, amount);
    }

    function balanceOf(address a) external view returns (uint256) {
        return balances[a];
    }

    function totalEther() external view returns (uint256) {
        return address(this).balance;
    }
}

/* Notes

Why CEI helps:
- Even if recipient's fallback/receive re-enters, the balance is already set to 0 (or reduced)
  so repeated withdrawals are not possible.

Why ReentrancyGuard helps:
- Blocks re-entry into any function marked nonReentrant within the same transaction.

Best practices:
- Prefer pull-based payments (users withdraw funds) instead of push-based (contract sends automatically)
- Minimize external calls and keep them last in function flow
- Consider checks on msg.sender (e.g., EOA-only isn't reliable due to contract wallets)
- When possible, use .transfer/.send to limit gas (but be mindful of gas stipend changes and EIP-1884 effects).
  Modern recommendation is careful .call with CEI + guard.

See vulnerable version for contrast:
- lessons/advanced/security/Reentrancy.sol
*/