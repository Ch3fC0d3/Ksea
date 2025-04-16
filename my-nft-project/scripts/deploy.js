// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // Deploy the NFT contract
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.deploy();
  
  await myNFT.deployed();
  console.log("MyNFT deployed to:", myNFT.address);
  console.log("Gas used for deployment:", myNFT.deployTransaction.gasLimit.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
