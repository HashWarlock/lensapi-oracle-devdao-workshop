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

  console.log('Setting attestor...');
  const attestor = process.env['LENSAPI_ORACLE_ENDPOINT'] ?? deployer.address;
  const question = await oracle.connect(deployer).lensNft();
  //await oracle.connect(deployer).setAttestor(attestor); // change this to the identity of your ActionOffchainRollup found in your LensAPI Oracle deployment labeled 'Oracle Endpoint'
  console.log(`${question} Done`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
