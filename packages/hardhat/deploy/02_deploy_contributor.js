// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("ContributorContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      "0x1d5a5b42e88D48b7De7f813954B91929A266B583",
      "0x1d5a5b42e88D48b7De7f813954B91929A266B583",
      "mockCIDfromIPFS",
      "Update FE",
      "100000000000000000",
      30,
    ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const ContributorContract = await ethers.getContract(
    "ContributorContract",
    deployer
  );
};
module.exports.tags = ["ContributorContract"];
