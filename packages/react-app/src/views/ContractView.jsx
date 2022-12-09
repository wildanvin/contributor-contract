import { Button, Divider } from "antd";
import React, { useState, useEffect } from "react";
import { utils } from "ethers";

import { useParams } from "react-router-dom";

import { Address, Balance } from "../components";

import { abi } from "./helper/contractABI";

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
  //const local = true;

  // const [contractBalance, setContractBalance] = useState(0);

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

  const contract = new ethers.Contract(params.address, abi, userSigner);

  useEffect(() => {
    // async function getBalance() {
    //   try {
    //     if (local) {
    //       const balance = await localProvider.getBalance(params.address);
    //     } else {
    //       const balance = await mainnetProvider.getBalance(params.address);
    //     }
    //     const balance = await localProvider.getBalance(params.address);
    //     setContractBalance(utils.formatEther(balance));
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }

    // getBalance();

    const getContractInfo = async function () {
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
    };

    getContractInfo();
  }, []);

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: "70%", margin: "auto", marginTop: 64 }}>
        <h2>Contributor Contract at:</h2>

        <Address address={params.address} ensProvider={mainnetProvider} fontSize={16} />
        {/* <h2>Balance: {contractBalance} ETH</h2> */}
        <br />
        <Balance address={params.address} provider={localProvider} price={price} />

        <Divider />
        <div style={{ margin: 8 }}>
          <div>
            <b>Approved:</b> {milestone.approved ? "YES" : "NO"} - <b>Claimed:</b> {milestone.claimed ? "YES" : "NO"}
          </div>
          <br />
          <div>
            <b>Contributor address:</b>{" "}
            <Address address={contributorAddress} ensProvider={mainnetProvider} fontSize={16} />
          </div>
          <div>
            <b>Task:</b> {milestone.task}
          </div>
          <div>
            <b>Reward:</b> {utils.formatEther(milestone.value)} ETH
          </div>
          <div>
            <b>Deadline:</b> {ethers.BigNumber.from(milestone.time).toNumber()}
          </div>

          <Button type="link">
            <a rel="noreferrer" href={`https://ipfs.io/ipfs/${doc}`} target="_blank">
              Signed Document
            </a>
          </Button>
          <Divider />
          <h3>Ubeswap Agent DAO</h3>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = tx({
                to: params.address,
                //value: utils.parseEther("0.001"),
                data: writeContracts.ContributorContract.interface.encodeFunctionData("approve()", []),
              });

              const data = await result;

              try {
                if (await data.nonce) {
                  setMilestone(milestone => ({
                    ...milestone,
                    approved: true,
                  }));
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Approve
          </Button>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = tx({
                to: params.address,
                //value: utils.parseEther("0.001"),
                data: writeContracts.ContributorContract.interface.encodeFunctionData("disapprove()", []),
              });
              const data = await result;

              try {
                if (await data.nonce) {
                  setMilestone(milestone => ({
                    ...milestone,
                    approved: false,
                  }));
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Disapprove
          </Button>
          <br />
          <Button
            style={{ marginTop: 8 }}
            onClick={() => {
              tx({
                to: params.address,
                //value: utils.parseEther("0.001"),
                data: writeContracts.ContributorContract.interface.encodeFunctionData("getAllFundsBack()", []),
              });
              /* this should throw an error about "no fallback nor receive function" until you add it */
            }}
          >
            Get funds back
          </Button>
          <Divider />
          <h3>Contributor</h3>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = tx({
                to: params.address,
                //value: utils.parseEther("0.001"),
                data: writeContracts.ContributorContract.interface.encodeFunctionData("withdrawProceeds()", []),
              });
              const data = await result;

              try {
                if (await data.nonce) {
                  setMilestone(milestone => ({
                    ...milestone,
                    claimed: true,
                  }));
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Withdraw Proceeds
          </Button>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
