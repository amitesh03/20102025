// 2_deploy_mytoken.js
// Deploy MyToken with constructor args from environment variables

const MyToken = artifacts.require("MyToken");

module.exports = async function (deployer) {
  const name = process.env.TOKEN_NAME || "MyToken";
  const symbol = process.env.TOKEN_SYMBOL || "MTK";
  const human = process.env.INITIAL_SUPPLY || "1000000"; // 1,000,000
  const decimals = BigInt(18);
  const initial = (BigInt(human) * (10n ** decimals)).toString();

  await deployer.deploy(MyToken, name, symbol, initial);
};