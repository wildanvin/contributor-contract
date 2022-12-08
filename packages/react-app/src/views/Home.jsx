import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState } from "react";

import { Link, Redirect, useHistory } from "react-router-dom";

import { Button, Card, Divider, Form, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Address, Balance, Events } from "../components";

import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

/* configure Infura auth settings */
const projectId = "2IWlNF0pxQ0tyk9NJ2ZdJfY2R0d";
const projectSecret = "ed412e1c5b0dfe4b0d29e8b20a75da09";
const auth = "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

/* create the client */
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
  owner,
}) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  const [formData, setFormData] = useState({
    contributor: "",
    doc: "",
    task: "",
    value: 0,
    time: 0,
  });

  const { contributor, doc, task, value, time } = formData;
  //const navigate = useNavigate();
  const history = useHistory();

  const onMutate = e => {
    // Text/Booleans/Numbers

    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onClick = async e => {
    e.preventDefault();
    tx(
      writeContracts.Factory.createContract(
        formData.contributor,
        formData.doc,
        formData.task,
        utils.parseEther(formData.value),
        formData.time,
      ),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          history.push("/contractsList");
        }
      },
    );
  };

  const submitToIPFS = async e => {
    //const file = e.target.files[0];
    //console.log(`the file ?? : ${JSON.stringify(e.target)}`);

    //const file = e.file;
    const file = e.target.files[0];

    console.log(`the file ?? : ${JSON.stringify(file)}`);

    try {
      const added = await client.add(file);
      //const url = `https://infura-ipfs.io/ipfs/${added.path}`;
      //updateFileUrl(url);
      console.log("IPFS URI: ", added);
      setFormData(prevState => ({
        ...prevState,
        [e.target.id]: added.path,
      }));
      console.log(formData);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  return (
    <div>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: "70%", margin: "auto", marginTop: 64 }}>
        <Card>
          Right now the owner is: <Address address={owner} ensProvider={mainnetProvider} fontSize={16} />
          <br />
          <p style={{ marginTop: 8 }}>Claim ownership to interact with the dapp:</p>
          <Button
            style={{ marginTop: 8 }}
            onClick={async () => {
              const result = tx(writeContracts.Factory.claimOwnership(), update => {
                console.log("📡 Transaction Update:", update);
                if (update && (update.status === "confirmed" || update.status === 1)) {
                  console.log(" 🍾 Transaction " + update.hash + " finished!");
                }
              });
              console.log("awaiting metamask/web3 confirm result...", result);
              console.log(await result);
            }}
          >
            Claim Ownership
          </Button>
        </Card>
        <Divider />
        <Card>
          <Form
            name="create-contract"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 8,
            }}
            initialValues={{
              remember: true,
            }}
            // onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Contributor"
              name="contributor"
              rules={[
                {
                  required: true,
                  message: "Please input contributor address",
                },
              ]}
            >
              <Input
                id="contributor"
                value={contributor}
                onChange={onMutate}
                placeholder="0x1d5a5b42e88D48b7De7f813954B91929A266B583"
              />
            </Form.Item>

            <Form.Item
              label="Document"
              name="document"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled placeholder={doc} />
            </Form.Item>

            <Form.Item
              label="Task"
              name="task"
              rules={[
                {
                  required: true,
                  message: "Please input the task to be completed",
                },
              ]}
            >
              <Input id="task" value={task} onChange={onMutate} placeholder="Task to be completed" />
            </Form.Item>

            <Form.Item
              label="Reward"
              name="reward"
              rules={[
                {
                  required: true,
                  message: "Enter a reward for the contributor",
                },
              ]}
            >
              <Input id="value" value={value} onChange={onMutate} placeholder="1 ETH" />
            </Form.Item>

            <Form.Item
              label="Time"
              name="time"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input id="time" value={time} onChange={onMutate} placeholder="30 seconds" />
            </Form.Item>

            <Form.Item label="Upload" valuePropName="fileList">
              <label htmlFor="doc">
                {" "}
                <input
                  /*
                  style={{
                    display: "none",
                  }}*/
                  onChange={submitToIPFS}
                  id="doc"
                  type="file"
                />
              </label>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 16,
              }}
            >
              <br />
              <Button onClick={onClick} type="primary" htmlType="submit">
                Create Contract
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default Home;
