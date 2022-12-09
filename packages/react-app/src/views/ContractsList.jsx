import React from "react";

import { FactoryEvents } from "../components";

export default function ContractsList({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  return (
    <div>
      <FactoryEvents
        contracts={readContracts}
        contractName="Factory"
        eventName="ContractCreated"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />
    </div>
  );
}
