// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./ContributorContract.sol";

/// @title Factory Contract
/// @author wildanvin
/// @notice Only the owner can create more contracts
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

    /// @notice The owner can create contracts for contributors with this function
    /// @notice How the owner address is passed when creating a contract with the "new" keyword
    /// @param _contributor Address of contributor
    /// @param _doc CID hash of the signed docment
    /// @param _task Brief description of the task to complete
    /// @param _value The reward for the contributor
    /// @param _time The amount of time the contributor has to complete the task. Right now the time is in seconds
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

    /// @notice Right now everyone can claim ownership for demo purposes
    function claimOwnership() public {
        owner = payable(msg.sender);
    }

    function getTotalContracts() public view returns (uint count) {
        return contractsArray.length;
    }
}
