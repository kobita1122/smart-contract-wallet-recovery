// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SmartWallet.sol";

contract WalletFactory {
    event WalletCreated(address indexed wallet, address indexed owner);

    function createWallet(uint256 _dailyLimit) external returns (address) {
        SmartWallet wallet = new SmartWallet(msg.sender, _dailyLimit);
        emit WalletCreated(address(wallet), msg.sender);
        return address(wallet);
    }
}
