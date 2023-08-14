import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
    const LensTreasureHunt = await ethers.getContractFactory("LensTreasureHunt");

    const [deployer] = await ethers.getSigners();

    const consumerSC = process.env['CONSUMER_CONTRACT_ADDRESS'] || "";
    const consumer = LensTreasureHunt.attach(consumerSC);
    await Promise.all([
        consumer.deployed(),
    ])

    console.log('Pushing a request to dig...');
    const digCost = ethers.utils.parseEther("0.0001");
    await consumer.connect(deployer).dig("0x8df1", {value: digCost, gasLimit: 1_000_000});
    console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
