const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying Factory with:", deployer.address);

    const Factory = await ethers.getContractFactory("WalletFactory");
    const factory = await Factory.deploy();
    await factory.waitForDeployment();
    const address = await factory.getAddress();

    console.log("Factory Deployed:", address);

    // Save Config
    const config = { factory: address, wallet: "" };
    fs.writeFileSync("wallet_config.json", JSON.stringify(config));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
