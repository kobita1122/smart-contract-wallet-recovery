const { ethers } = require("hardhat");
const config = require("./wallet_config.json");

async function main() {
    const [owner] = await ethers.getSigners();
    const wallet = await ethers.getContractAt("SmartWallet", config.wallet, owner);

    // Fund the wallet first
    await owner.sendTransaction({
        to: config.wallet,
        value: ethers.parseEther("2.0")
    });

    const amount = ethers.parseEther("0.5"); // Below daily limit of 1.0

    console.log("Executing Transfer via Smart Wallet...");
    
    const tx = await wallet.execute(
        "0x000000000000000000000000000000000000dEaD", 
        amount, 
        "0x"
    );
    await tx.wait();

    console.log("Transfer Successful! Daily limit updated.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
