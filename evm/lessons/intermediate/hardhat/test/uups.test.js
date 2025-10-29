// UUPS upgrade tests for BoxUpgradeable
// Validates deployProxy/upgradeProxy flow and state preservation

const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("UUPS: BoxUpgradeable", function () {
  let BoxV1, BoxV2, proxy, owner, other;

  const INITIAL = 42n;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    BoxV1 = await ethers.getContractFactory("BoxV1Upgradeable", owner);
    BoxV2 = await ethers.getContractFactory("BoxV2Upgradeable", owner);

    proxy = await upgrades.deployProxy(BoxV1, [INITIAL], {
      kind: "uups",
      initializer: "initialize",
    });
    await proxy.waitForDeployment();
  });

  it("deploys proxy and sets initial value", async function () {
    const addr = await proxy.getAddress();
    expect(addr).to.properAddress;

    const value = await proxy.retrieve();
    expect(value).to.equal(INITIAL);

    const version = await proxy.version();
    expect(version).to.equal("V1");
  });

  it("only owner can store and upgrade", async function () {
    // store works for owner
    await expect(proxy.store(100n))
      .to.emit(proxy, "ValueChanged")
      .withArgs(100n);

    // non-owner cannot store
    await expect(proxy.connect(other).store(123n)).to.be.reverted;

    // non-owner cannot upgrade (authorization in _authorizeUpgrade)
    await expect(upgrades.upgradeProxy(await proxy.getAddress(), BoxV2.connect(other))).to.be.reverted;
  });

  it("upgrades proxy to V2 and preserves state", async function () {
    const before = await proxy.retrieve();
    expect(before).to.equal(INITIAL);

    const upgraded = await upgrades.upgradeProxy(await proxy.getAddress(), BoxV2);
    await upgraded.waitForDeployment();

    const implAddress = await upgrades.erc1967.getImplementationAddress(await upgraded.getAddress());
    expect(implAddress).to.properAddress;

    // Version changed, state preserved
    expect(await upgraded.version()).to.equal("V2");
    expect(await upgraded.retrieve()).to.equal(INITIAL);

    // New function increment() exists and works
    const tx = await upgraded.increment();
    await tx.wait();

    const afterInc = await upgraded.retrieve();
    expect(afterInc).to.equal(INITIAL + 1n);
  });
});