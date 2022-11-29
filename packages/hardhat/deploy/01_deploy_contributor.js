// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("Factory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    //args: [],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const Factory = await ethers.getContract("Factory", deployer);
};
module.exports.tags = ["Factory"];
