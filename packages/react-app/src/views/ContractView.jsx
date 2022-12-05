import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState, useEffect } from "react";
import { utils } from "ethers";

import { useParams } from "react-router-dom";

import { Address, Balance, Events } from "../components";

import { abi } from "./helper/contractABI";
import { useBalance } from "eth-hooks";

const { ethers } = require("ethers");

export default function ContractView({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  userSigner,
  localProviderPollingTime,
}) {
  const local = true;
  const [newPurpose, setNewPurpose] = useState("loading...");
  //const [contractAddress, setContractAddress] = useState("");
  const [contractBalance, setContractBalance] = useState(0);

  const [doc, setDoc] = useState("");
  const [contributorAddress, setContributorAddress] = useState("");

  const [milestone, setMilestone] = useState({
    task: "",
    value: 0,
    time: 0,
    approved: false,
    claimed: false,
  });

  const params = useParams();

  // if (params.address == ":address") {
  //   return <div>Go to contracts Lists</div>;
  // }

  const contract = new ethers.Contract(params.address, abi, userSigner);

  useEffect(() => {
    async function getBalance() {
      try {
        if (local) {
          const balance = await localProvider.getBalance(params.address);
        } else {
          const balance = await mainnetProvider.getBalance(params.address);
        }
        const balance = await localProvider.getBalance(params.address);
        setContractBalance(utils.formatEther(balance));
      } catch (error) {
        console.log(error);
      }
    }

    getBalance();

    async function getContractInfo() {
      try {
        const milestone = await contract.milestone();
        setMilestone(milestone);
        const doc = await contract.doc();
        setDoc(doc);
        const contributor = await contract.contributor();
        setContributorAddress(contributor);
      } catch (error) {
        console.log(error);
      }
    }

    getContractInfo();
  }, []);

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: "70%", margin: "auto", marginTop: 64 }}>
        <h2>Contributor Contract at:</h2>

        <Address address={params.address} ensProvider={mainnetProvider} fontSize={16} />
        <h2>Balance: {contractBalance} ETH</h2>
        <Balance address={params.address} provider={localProvider} price={price} />

        <Divider />
        <div style={{ margin: 8 }}>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              console.log(`the address is: ${params.address}`);

              try {
                const txResponse = await contract.milestone();
                //await listenForTransactionMine(txResponse, provider);
                console.log("Done!");
                console.log(txResponse);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Get milestone
          </Button>

          <Divider />

          <div>
            Approved: {milestone.approved ? "YES" : "NO"} - Claimed: {milestone.claimed ? "YES" : "NO"}
          </div>

          <div>
            Contributor address: <Address address={contributorAddress} ensProvider={mainnetProvider} fontSize={16} />
          </div>
          <div>Task: {milestone.task}</div>
          <div>Reward: {utils.formatEther(milestone.value)} ETH</div>

          <div>Deadline: {ethers.BigNumber.from(milestone.time).toNumber()}</div>

          <div>Signed Document: {doc}</div>

          <Divider />
          <h3>Ubeswap Agent DAO</h3>
          <Button style={{ marginTop: 8 }}>Increase Proceeds</Button>
          <Button style={{ marginTop: 8 }}>Decrease Proceeds</Button>
          <Button style={{ marginTop: 8 }}>Get funds back</Button>

          <Divider />
          <h3>Contributor</h3>
          <Button style={{ marginTop: 8 }}>Withdraw Proceeds</Button>
        </div>
      </div>
    </div>
  );
}
