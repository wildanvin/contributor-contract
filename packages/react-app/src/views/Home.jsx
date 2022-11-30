import { useContractReader } from "eth-hooks";
import { ethers, utils } from "ethers";
import React, { useState } from "react";

import { Link, Redirect, useHistory } from "react-router-dom";

import { Button, Card, Divider, Form, Input } from "antd";
import { Address, Balance, Events } from "../components";

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
          history.push("/exampleui");
        }
      },
    );
    // let createClassroomTx = await classroomFactory.methods
    //   .createClassroom(formData.sessions)
    //   .send({ from: props.accounts[0] })
    //   .on('receipt', async function (receipt) {
    //     alert(`Classroom created successfully`)
    //   })

    //navigate(`/classroom/${idAddress}`);
    //return <Redirect to="/exampleui" />;
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
              <Input id="doc" value={doc} onChange={onMutate} placeholder="CID hash" />
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

            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 16,
              }}
            >
              <Button onClick={onClick} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>

          <section className="form">
            <form>
              {/* <div className="form-group">
                <button onClick={onClick} className="btn btn-block">
                  Create Classroom
                </button>
                <br />
                <br />
                <br />
              </div> */}
            </form>
          </section>
        </Card>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>📝</span>
        This Is Your App Home. You can start editing it in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/react-app/src/views/Home.jsx
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>✏️</span>
        Edit your smart contract{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          YourContract.sol
        </span>{" "}
        in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          packages/hardhat/contracts
        </span>
      </div>
      {!purpose ? (
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>👷‍♀️</span>
          You haven't deployed your contract yet, run
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            yarn chain
          </span>{" "}
          and{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            yarn deploy
          </span>{" "}
          to deploy your first contract!
        </div>
      ) : (
        <div style={{ margin: 32 }}>
          <span style={{ marginRight: 8 }}>🤓</span>
          The "purpose" variable from your contract is{" "}
          <span
            className="highlight"
            style={{
              marginLeft: 4,
              /* backgroundColor: "#f9f9f9", */ padding: 4,
              borderRadius: 4,
              fontWeight: "bolder",
            }}
          >
            {purpose}
          </span>
        </div>
      )}

      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🤖</span>
        An example prop of your balance{" "}
        <span style={{ fontWeight: "bold", color: "green" }}>({ethers.utils.formatEther(yourLocalBalance)})</span> was
        passed into the
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          Home.jsx
        </span>{" "}
        component from
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          App.jsx
        </span>
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>💭</span>
        Check out the <Link to="/hints">"Hints"</Link> tab for more tips.
      </div>
      <div style={{ margin: 32 }}>
        <span style={{ marginRight: 8 }}>🛠</span>
        Tinker with your smart contract using the <Link to="/debug">"Debug Contract"</Link> tab.
      </div>
    </div>
  );
}

export default Home;
