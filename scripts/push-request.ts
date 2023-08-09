import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const LensOracleStatMinter = await ethers.getContractFactory("LensOracleStatMinter");

  const [deployer] = await ethers.getSigners();
  const { name: network } = await ethers.provider.getNetwork();

  const consumerSC = (network == 'polygon') ? process.env['POLYGON_MAINNET_CONSUMER_SC'] : process.env['POLYGON_MUMBAI_CONSUMER_SC'];
  const oracle = await LensOracleStatMinter.attach(consumerSC ?? "");
  await Promise.all([
    oracle.deployed(),
  ])

  console.log('Pushing a request...');
  await oracle.connect(deployer).request("0x8221");
  console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
