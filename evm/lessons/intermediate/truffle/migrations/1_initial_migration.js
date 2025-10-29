// 1_initial_migration.js
// Truffle requires this migration to bootstrap its migration system

const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};