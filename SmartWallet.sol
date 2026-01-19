// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SmartWallet {
    address public owner;
    uint256 public dailyLimit;
    uint256 public spentToday;
    uint256 public lastDay;

    mapping(address => bool) public isGuardian;
    mapping(address => mapping(address => bool)) public guardianVotes; // NewOwner -> Guardian -> Voted
    mapping(address => uint256) public recoveryVotes; // NewOwner -> Count
    uint256 public guardianCount;
    uint256 public constant RECOVERY_THRESHOLD = 3;

    event Transfer(address indexed to, uint256 amount);
    event RecoveryInitiated(address indexed newOwner, address indexed guardian);
    event OwnerRotated(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _owner, uint256 _limit) {
        owner = _owner;
        dailyLimit = _limit;
        lastDay = block.timestamp / 1 days;
    }

    receive() external payable {}

    function addGuardian(address _guardian) external onlyOwner {
        require(!isGuardian[_guardian], "Already guardian");
        isGuardian[_guardian] = true;
        guardianCount++;
    }

    function execute(address payable _to, uint256 _amount, bytes memory _data) external onlyOwner {
        // Reset daily limit logic
        if (block.timestamp / 1 days > lastDay) {
            spentToday = 0;
            lastDay = block.timestamp / 1 days;
        }

        require(spentToday + _amount <= dailyLimit, "Daily limit exceeded");
        require(address(this).balance >= _amount, "Insufficient funds");

        spentToday += _amount;
        
        (bool success, ) = _to.call{value: _amount}(_data);
        require(success, "Tx failed");
        
        emit Transfer(_to, _amount);
    }

    // Social Recovery Logic
    function initiateRecovery(address _newOwner) external {
        require(isGuardian[msg.sender], "Not a guardian");
        require(!guardianVotes[_newOwner][msg.sender], "Already voted");

        guardianVotes[_newOwner][msg.sender] = true;
        recoveryVotes[_newOwner]++;

        emit RecoveryInitiated(_newOwner, msg.sender);

        if (recoveryVotes[_newOwner] >= RECOVERY_THRESHOLD) {
            emit OwnerRotated(owner, _newOwner);
            owner = _newOwner;
            // Reset votes for safety (simplified)
            recoveryVotes[_newOwner] = 0;
        }
    }
}
