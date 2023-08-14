import { ethers } from "hardhat";
import "dotenv/config";

async function main() {
  const LensTreasureHunt = await ethers.getContractFactory("LensTreasureHunt");

  const [deployer] = await ethers.getSigners();

  console.log('Deploying...');
  const attestor = process.env['LENSAPI_ORACLE_ENDPOINT'] || deployer.address;  // When deploy for real e2e test, change it to the real attestor wallet.
  const consumer = await LensTreasureHunt.deploy(attestor, 0);
  await consumer.deployed();
  console.log('Deployed', {
    LensTreasureHunt: consumer.address,
  });

  console.log('Configuring...');
  const digCost = ethers.utils.parseEther("0.0001");
  await consumer.connect(deployer).setDigCost(digCost);
  await consumer.connect(deployer).setLensTreasureHuntNftURI(1, "ipfs://QmUL6zuhq4vWb1fSKwPBGqEe8yiuEZ3LqUo5GTuY6AEXBc/FirstPhase.png");
  await consumer.connect(deployer).setLensTreasureHuntNftURI(2, "ipfs://QmUL6zuhq4vWb1fSKwPBGqEe8yiuEZ3LqUo5GTuY6AEXBc/SecondPhase.png");
  await consumer.connect(deployer).setLensTreasureHuntNftURI(3, "ipfs://QmUL6zuhq4vWb1fSKwPBGqEe8yiuEZ3LqUo5GTuY6AEXBc/ThirdPhase.png");
  await consumer.connect(deployer).setLensTreasureHuntNftURI(4, "ipfs://QmUL6zuhq4vWb1fSKwPBGqEe8yiuEZ3LqUo5GTuY6AEXBc/FourthPhase.png");
  await consumer.connect(deployer).setLensTreasureHuntNftURI(5, "ipfs://QmUL6zuhq4vWb1fSKwPBGqEe8yiuEZ3LqUo5GTuY6AEXBc/FifthPhase.png");
  console.log('Done');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
