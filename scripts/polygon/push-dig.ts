import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
    const LensTreasureHunt = await ethers.getContractFactory("LensTreasureHunt");

    const [deployer] = await ethers.getSigners();

    const consumerSC = process.env['POLYGON_CONSUMER_CONTRACT_ADDRESS'] || "";
    const consumer = LensTreasureHunt.attach(consumerSC);
    await Promise.all([
        consumer.deployed(),
    ])

    console.log('Pushing a request to dig...');
    const digCost = await consumer.connect(deployer).digCost();
    console.log(`digCost: ${digCost}`);
    await consumer.connect(deployer).dig("0x8df1", {value: digCost, gasLimit: 1_000_000});
    console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
