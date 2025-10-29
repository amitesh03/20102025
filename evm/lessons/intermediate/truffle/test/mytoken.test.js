// test/mytoken.test.js
// Truffle + Mocha/Chai tests for MyToken (OpenZeppelin ERC20)

const MyToken = artifacts.require("MyToken");
const { assert } = require("chai");

// Helpers
const toWei = (n) => web3.utils.toWei(n, "ether");
const fromWei = (v) => web3.utils.fromWei(v, "ether");

contract("MyToken", (accounts) => {
  const [deployer, user1, user2] = accounts;

  // Values matching migrations (DEFAULTS): name=MyToken, symbol=MTK, initial = 1_000_000 * 10^18
  const EXPECTED_NAME = process.env.TOKEN_NAME || "MyToken";
  const EXPECTED_SYMBOL = process.env.TOKEN_SYMBOL || "MTK";
  const EXPECTED_INITIAL_HUMAN = process.env.INITIAL_SUPPLY || "1000000";

  let token;

  before(async () => {
    token = await MyToken.deployed();
    assert.ok(token.address, "Token should be deployed");
  });

  it("has correct metadata", async () => {
    const name = await token.name();
    const symbol = await token.symbol();
    const decimals = await token.decimals();

    assert.equal(name, EXPECTED_NAME, "name mismatch");
    assert.equal(symbol, EXPECTED_SYMBOL, "symbol mismatch");
    assert.equal(decimals.toString(), "18", "decimals mismatch");
  });

  it("mints initial supply to deployer", async () => {
    const totalSupply = await token.totalSupply();
    const deployerBal = await token.balanceOf(deployer);

    assert.equal(
      fromWei(totalSupply.toString()),
      EXPECTED_INITIAL_HUMAN,
      "total supply mismatch"
    );
    assert.equal(
      fromWei(deployerBal.toString()),
      EXPECTED_INITIAL_HUMAN,
      "deployer balance mismatch"
    );
  });

  it("transfers tokens between accounts", async () => {
    const amount = toWei("500");

    // deployer -> user1
    const receipt1 = await token.transfer(user1, amount, { from: deployer });
    assert.ok(receipt1.receipt.status, "transfer failed");

    let balDeployer = await token.balanceOf(deployer);
    let balUser1 = await token.balanceOf(user1);
    assert.equal(fromWei(balUser1.toString()), "500", "user1 balance mismatch");
    assert.equal(
      fromWei(balDeployer.toString()),
      (BigInt(EXPECTED_INITIAL_HUMAN) - 500n).toString(),
      "deployer balance after first transfer mismatch"
    );

    // user1 -> user2
    const receipt2 = await token.transfer(user2, amount, { from: user1 });
    assert.ok(receipt2.receipt.status, "transfer failed");
    balUser1 = await token.balanceOf(user1);
    const balUser2 = await token.balanceOf(user2);

    assert.equal(fromWei(balUser1.toString()), "0", "user1 balance after transfer mismatch");
    assert.equal(fromWei(balUser2.toString()), "500", "user2 balance mismatch");
  });

  it("prevents non-owners from minting", async () => {
    const amount = toWei("10");
    // Ownable v5 uses custom errors; Truffle does not decode them to strings.
    // We simply assert revert.
    try {
      await token.mint(user1, amount, { from: user1 });
      assert.fail("Mint should have reverted for non-owner");
    } catch (e) {
      assert.include(e.message, "revert", "expected revert on non-owner mint");
    }
  });

  it("owner can mint and total supply updates", async () => {
    const amount = toWei("1234");

    const beforeTotal = await token.totalSupply();
    const beforeBal = await token.balanceOf(user1);

    const receipt = await token.mint(user1, amount, { from: deployer });
    assert.ok(receipt.receipt.status, "mint failed");

    const afterTotal = await token.totalSupply();
    const afterBal = await token.balanceOf(user1);

    const deltaTotal = BigInt(afterTotal.toString()) - BigInt(beforeTotal.toString());
    const deltaBal = BigInt(afterBal.toString()) - BigInt(beforeBal.toString());

    assert.equal(deltaTotal.toString(), amount, "total supply delta mismatch");
    assert.equal(deltaBal.toString(), amount, "user1 balance delta mismatch");
  });

  it("fails transfer when sender has insufficient balance", async () => {
    const tooMuch = toWei("1"); // user1 initially has 0 (before mint test)
    try {
      await token.transfer(deployer, tooMuch, { from: user1 });
      assert.fail("Transfer should revert on insufficient balance");
    } catch (e) {
      assert.include(e.message, "revert", "expected revert on insufficient balance");
    }
  });
});