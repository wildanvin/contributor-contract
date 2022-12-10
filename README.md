# 🤝 Ubeswap Contributor Management

This is a project for the Ubeswap hackaton, it is a dapp that lets a DAO distribute grants to contributors. The Dao can approve, cancel the payment or get the funds back if milestones are not met. The [Ubeswap DAO Contributor Agreement](https://docs.google.com/document/d/101BINrXZhpJU148X-zO9kl7JDqHHZqBmddjm9ByohxQ/edit?usp=sharing) is stored in IPFS and its CID is stored in the smart contract.

There are two smart contracts in this dapp: `Factory.sol` and `ContributorContract.sol`. The basic flow would be as follow:

1. Through the front end, the DAO will interact with the `Factory` contract to create different instances of a `ContributorContract`.
2. The front end will display a list with all the `ContributorContract`s created.
3. After the deadline the DAO can approve, disapprove, or get the funds back from the `ContributorContract`.
4. If the `ContributorContract` gets approved by the DAO, the contributor can claim the reward.

# Live demo

I deployed to goerli testnet. You can interact with the dapp in this link.
Here is a demo video on youtube.
The contracts are deployed at this addresses:

# Directory Structure

Scaffold-Eth provides a lot of nice functionality that I did not use for this project. The folders that contain all the app functionaliy are:

- `packages/react-app`: contains all the front end in react.
- `packages/hardhat`: contains the solidity contracts and deploy scripts.

Regarding the front end, the important components are located at:

- `packages/react-app/src/views/ContractList`: this componenet displays the contracts created by the DAO.
- `packages/react-app/src/views/components/FactoryEvents`: this is a component that I modified slightly from the `Events` component provided by Scaffold-Eth.
- `packages/react-app/src/views/Home`: it shows the interface to the DAO agent to create more contracts.
- `packages/react-app/src/views/ContractView`: it displays the info of each created contract like deadline, contributor address, reward, etc.

# Run the project locally

One of the nice things of Scaffold-Eth is that is very easy to run a project locally, as prerequisites you will need [Node (v16 LTS)](https://nodejs.org/en/download/) plus [Yarn (v1.x)](https://classic.yarnpkg.com/en/docs/install/) and [Git](https://git-scm.com/downloads)

> clone/fork:

```bash
git clone https://github.com/wildanvin/contributor-contract
```

> install and start your 👷‍ Hardhat chain:

```bash
cd contributor-contract
yarn install
yarn chain
```

> in a second terminal window, start your 📱 frontend:

```bash
cd contributor-contract
yarn start
```

> in a third terminal window, 🛰 deploy your contract:

```bash
cd contributor-contract
yarn deploy
```

📱 Open http://localhost:3000 to see the app

## IPFS

To upload the document to IPFS I followed this [tutorial](https://dev.to/edge-and-node/uploading-files-to-ipfs-from-a-web-application-50a). You will need to create an IPFS project in [Infura](https://www.infura.io/) and create a `.env` file inside `packages/react-app` like this one:

```bash
REACT_APP_IPFS_PROJECT_ID="<your-infura-project-id>"
REACT_APP_IPFS_PROJECT_SECRET="<your-infura-project-secret>"
```

# Deploy the project to a testnet

When deploying remember to change the block number for indexing events in `FactoryEvents.jsx`

# For the future:

- Improve the front end.
- Sign a message or the document with metamask or any other wallet.
- Write tests for the smart contracts.
- Run the tools like slither, echidna and manticore in order to detect bugs in the contracts.
- Deploy a subgraph so it is easier to search the contracts created by task, contributor, deadline, etc.
- The possibility to add more than one task in each smart contract
