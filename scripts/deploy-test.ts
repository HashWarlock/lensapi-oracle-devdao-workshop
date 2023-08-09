import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const LensOracleStatMinter = await ethers.getContractFactory("LensOracleStatMinter");

  const [deployer] = await ethers.getSigners();

  console.log('Deploying...');
  const attestor = process.env['LENSAPI_ORACLE_ENDPOINT'] ?? deployer.address;  // When deploy for real e2e test, change it to the real attestor wallet.
  const nftContract = process.env['NFT_COLLECTION_ADDRESS'] ?? '0x0';
  const oracle = await LensOracleStatMinter.deploy(attestor, nftContract);
  await oracle.deployed();
  console.log('Deployed', {
    oracle: oracle.address,
  });

  console.log('Configuring...');
  await oracle.connect(deployer).request("0x01c567");
  console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
