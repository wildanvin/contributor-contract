// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ContributorContract.sol";

contract Factory {
    event ContractCreated(address ContractAddress, string task, address Contributor);

    address payable public owner;
    ContributorContract[] public contractsArray;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = payable(msg.sender);
    }

    function createContract(
        address payable _contributor,
        string memory _doc,
        string memory _task,
        uint _value,
        uint _time
    ) public onlyOwner {
        ContributorContract contrib_contract = (new ContributorContract)(
            owner,
            _contributor,
            _doc,
            _task,
            _value,
            _time
        );
        contractsArray.push(contrib_contract);

        emit ContractCreated(
            address(contractsArray[contractsArray.length - 1]),
            _task,
            _contributor
        );
    }

    function claimOwnership() public {
        owner = payable(msg.sender);
    }

    function getTotalContracts() public view returns (uint count) {
        return contractsArray.length;
    }
}
