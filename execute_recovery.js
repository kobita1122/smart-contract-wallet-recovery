const { ethers } = require("hardhat");
const config = require("./wallet_config.json");

async function main() {
    const [_, g1, g2, g3, newOwner] = await ethers.getSigners();
    const wallet = await ethers.getContractAt("SmartWallet", config.wallet);

    console.log("Initiating Recovery Process...");
    console.log(`New Proposed Owner: ${newOwner.address}`);

    // Guardian 1 Votes
    console.log("Guardian 1 Voting...");
    await wallet.connect(g1).initiateRecovery(newOwner.address);

    // Guardian 2 Votes
    console.log("Guardian 2 Voting...");
    await wallet.connect(g2).initiateRecovery(newOwner.address);

    // Guardian 3 Votes (Threshold Reached)
    console.log("Guardian 3 Voting...");
    await wallet.connect(g3).initiateRecovery(newOwner.address);

    const currentOwner = await wallet.owner();
    console.log(`\nRecovery Complete! Wallet Owner is now: ${currentOwner}`);
    
    if (currentOwner === newOwner.address) {
        console.log("SUCCESS: Access Restored.");
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
