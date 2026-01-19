const { ethers } = require("hardhat");
const fs = require("fs");
const config = require("./wallet_config.json");

async function main() {
    const [owner] = await ethers.getSigners();
    const factory = await ethers.getContractAt("WalletFactory", config.factory, owner);

    const limit = ethers.parseEther("1.0"); // 1 ETH daily limit

    console.log("Creating Smart Wallet...");
    
    const tx = await factory.createWallet(limit);
    const receipt = await tx.wait();

    // In local dev, we fetch the event manually
    const filter = factory.filters.WalletCreated(null, owner.address);
    const events = await factory.queryFilter(filter);
    const walletAddr = events[events.length - 1].args[0];

    console.log(`Smart Wallet Created at: ${walletAddr}`);

    config.wallet = walletAddr;
    fs.writeFileSync("wallet_config.json", JSON.stringify(config));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
