import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const LensTreasureHunt = await ethers.getContractFactory("LensTreasureHunt");

  const [deployer] = await ethers.getSigners();
  const { name: network } = await ethers.provider.getNetwork();

  const consumerSC = (network == 'polygon') ? process.env['POLYGON_MAINNET_CONSUMER_SC'] : process.env['POLYGON_MUMBAI_CONSUMER_SC'];
  const consumer = await LensTreasureHunt.attach(consumerSC ?? "");
  await Promise.all([
    consumer.deployed(),
  ])

  console.log('Pushing a request...');
  await consumer.connect(deployer).dig("0x8221");
  console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
