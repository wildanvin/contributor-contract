// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

/// @title Contributor Contract
/// @author wildanvin
/// @notice The Dao and the contributor interact with instances of this contract in order to approve payments (Dao) and receive payments (contributor)
contract ContributorContract {
    event Deposit(address indexed sender, uint amount, uint balance);

    struct Milestone {
        string task;
        uint value;
        uint time;
        bool approved;
        bool claimed;
    }

    address payable public owner;
    address payable public contributor;
    string public doc;
    Milestone public milestone;
    mapping(address => uint) public proceeds;

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    modifier onlyContributor() {
        require(msg.sender == contributor, "not contributor");
        _;
    }

    /// @param _owner The owner of the contract. The Dao in this case
    /// @param _contributor Address of contributor
    /// @param _doc CID hash of the signed docment
    /// @param _task Brief description of the task to complete
    /// @param _value The reward for the contributor
    /// @param _time The amount of time the contributor has to complete the task. Right now the time is in seconds
    /// @notice These parameters are passed when the Dao creates the contract using the Factory contract
    constructor(
        address payable _owner,
        address payable _contributor,
        string memory _doc,
        string memory _task,
        uint _value,
        uint _time
    ) {
        owner = _owner;
        contributor = _contributor;
        doc = _doc;

        milestone.task = _task;
        milestone.value = _value;
        milestone.time = block.timestamp + _time * 1 seconds; // instead of "seconds" should be "days" in a realistic enviroment
        milestone.approved = false;
        milestone.claimed = false;
    }

    /// @notice The Dao can only call this function after the deadline
    /// @notice The proceeds mapping is updated accordingly
    function approve() public onlyOwner {
        require(block.timestamp >= milestone.time, "not time yet");
        milestone.approved = true;
        proceeds[contributor] = milestone.value;
    }

    function disapprove() public onlyOwner {
        require(block.timestamp >= milestone.time, "not time yet");
        milestone.approved = false;
        proceeds[contributor] = 0;
    }

    function getAllFundsBack() public onlyOwner {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    /// @notice The proceeds mapping is updated to 0 before sending the reward.
    function withdrawProceeds() external onlyContributor {
        uint reward = proceeds[msg.sender];
        require(milestone.approved == true, "not approved");
        require(reward > 0, "no reward");
        proceeds[msg.sender] = 0;
        milestone.claimed = true;
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
