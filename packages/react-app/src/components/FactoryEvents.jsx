import { List, Button } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import Address from "./Address";
import { Link } from "react-router-dom";

/**
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
**/

export default function FactoryEvents({
  contracts,
  contractName,
  eventName,
  localProvider,
  mainnetProvider,
  startBlock,
}) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>Contracts created:</h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args.sender + "_"}>
              <div style={{ fontSize: 18, fontWeight: 900 }}>Task: {item.args[1]}</div>
              Deployed at:
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              <br />
              Contributor:
              <Address address={item.args[2]} ensProvider={mainnetProvider} fontSize={16} />
              <br />
              <Button style={{ marginTop: 8 }} onClick={async () => {}}>
                <Link to={`/contractView/${item.args[0]}`}>View Details</Link>
              </Button>
            </List.Item>
          );
        }}
      />
    </div>
  );
}
