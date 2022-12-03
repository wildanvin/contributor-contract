// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

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

    constructor(
        address payable _owner,
        address payable _contributor,
        string memory _doc,
        string memory _task,
        uint _value,
        uint _time
    ) {
        // Set the transaction sender as the owner of the contract.
        owner = _owner;
        contributor = _contributor;
        doc = _doc;

        milestone.task = _task;
        milestone.value = _value;
        milestone.time = block.timestamp + _time * 1 seconds; // instead of "seconds" should be "days" in a realistic enviroment
        milestone.approved = false;
        milestone.claimed = false;
    }

    function increaseProceeds() public onlyOwner {
        require(block.timestamp >= milestone.time);
        milestone.approved = true;
        proceeds[contributor] = milestone.value;
    }

    function decreaseProceeds() public onlyOwner {
        require(block.timestamp >= milestone.time);
        milestone.approved = false;
        proceeds[contributor] = 0;
    }

    function getAllFundsBack() public onlyOwner {
        (bool sent, ) = owner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    function withdrawProceeds() external onlyContributor {
        uint reward = proceeds[msg.sender];
        require(reward > 0, "no reward");
        require(milestone.approved == true, "not approved");
        proceeds[msg.sender] = 0;
        milestone.claimed = true;
        (bool success, ) = payable(msg.sender).call{value: reward}("");
        require(success, "Transfer failed");
    }

    function test() public pure returns (string memory){
        return "hey fren";
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value, address(this).balance);
    }
}
