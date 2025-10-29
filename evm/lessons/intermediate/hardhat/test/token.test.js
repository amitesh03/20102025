/**
 * MyToken ERC20 tests (Mocha/Chai with Hardhat Toolbox)
 * Maps to syllabus: Testing strategies (unit tests, events, access control)
 *
 * Run:
 *  cd lessons/intermediate/hardhat
 *  npx hardhat test
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyToken", function () {
  let Token, token, deployer, user1, user2;

  const NAME = "MyToken";
  const SYMBOL = "MTK";
  const DECIMALS = 18n;
  const INITIAL_HUMAN = "1000000"; // 1,000,000 tokens
  const INITIAL_SUPPLY = ethers.parseUnits(INITIAL_HUMAN, DECIMALS);

  beforeEach(async function () {
    [deployer, user1, user2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("MyToken");
    token = await Token.deploy(NAME, SYMBOL, INITIAL_SUPPLY);
    await token.waitForDeployment();
  });

  it("has correct metadata", async function () {
    expect(await token.name()).to.equal(NAME);
    expect(await token.symbol()).to.equal(SYMBOL);
    // decimals() returns a number for uint8
    expect(await token.decimals()).to.equal(18);
  });

  it("mints initial supply to deployer", async function () {
    const total = await token.totalSupply();
    const balDeployer = await token.balanceOf(deployer.address);
    expect(total).to.equal(INITIAL_SUPPLY);
    expect(balDeployer).to.equal(INITIAL_SUPPLY);
  });

  it("transfers tokens between accounts", async function () {
    const amount = ethers.parseUnits("1000", DECIMALS);
    await expect(token.transfer(user1.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(deployer.address, user1.address, amount);

    expect(await token.balanceOf(deployer.address)).to.equal(
      INITIAL_SUPPLY - amount
    );
    expect(await token.balanceOf(user1.address)).to.equal(amount);

    // user1 -> user2
    await expect(token.connect(user1).transfer(user2.address, amount))
      .to.emit(token, "Transfer")
      .withArgs(user1.address, user2.address, amount);

    expect(await token.balanceOf(user1.address)).to.equal(0n);
    expect(await token.balanceOf(user2.address)).to.equal(amount);
  });

  it("prevents non-owners from minting", async function () {
    const to = user1.address;
    const amount = ethers.parseUnits("5", DECIMALS);
    await expect(token.connect(user1).mint(to, amount))
      .to.be.revertedWithCustomError(token, "OwnableUnauthorizedAccount")
      .withArgs(user1.address);
  });

  it("owner can mint and total supply updates", async function () {
    const to = user1.address;
    const amount = ethers.parseUnits("2500", DECIMALS);

    const totalBefore = await token.totalSupply();
    await expect(token.mint(to, amount))
      .to.emit(token, "Transfer")
      .withArgs(ethers.ZeroAddress, to, amount);

    const totalAfter = await token.totalSupply();
    const balTo = await token.balanceOf(to);
    expect(totalAfter).to.equal(totalBefore + amount);
    expect(balTo).to.equal(amount);
  });

  it("emits Transfer events on transfers", async function () {
    const a = ethers.parseUnits("123", DECIMALS);
    const b = ethers.parseUnits("77", DECIMALS);

    await expect(token.transfer(user1.address, a))
      .to.emit(token, "Transfer")
      .withArgs(deployer.address, user1.address, a);

    await expect(token.connect(user1).transfer(user2.address, b))
      .to.emit(token, "Transfer")
      .withArgs(user1.address, user2.address, b);
  });

  it("fails transfers when balance is insufficient", async function () {
    // user1 has 0 initially
    const tooMuch = ethers.parseUnits("1", DECIMALS);
    await expect(
      token.connect(user1).transfer(deployer.address, tooMuch)
    ).to.be.reverted; // standard ERC20 insufficient balance revert
  });
});