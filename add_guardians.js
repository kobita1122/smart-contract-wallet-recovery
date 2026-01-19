const { ethers } = require("hardhat");
const config = require("./wallet_config.json");

async function main() {
    const [owner, g1, g2, g3] = await ethers.getSigners();
    const wallet = await ethers.getContractAt("SmartWallet", config.wallet, owner);

    console.log("Adding Guardians...");
    
    // We need 3 guardians for recovery threshold
    await (await wallet.addGuardian(g1.address)).wait();
    await (await wallet.addGuardian(g2.address)).wait();
    await (await wallet.addGuardian(g3.address)).wait();

    console.log(`Guardians Added: \n${g1.address}\n${g2.address}\n${g3.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
