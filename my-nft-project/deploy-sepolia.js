// deploy-sepolia.js - Simple deployment script for Sepolia testnet
require('dotenv').config();
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying MyNFT contract to Sepolia...");
  
  // Get the contract factory
  const MyNFT = await ethers.getContractFactory("MyNFT");
  
  // Deploy the contract
  const myNFT = await MyNFT.deploy();
  
  // Wait for deployment to finish
  await myNFT.deployed();
  
  console.log("MyNFT deployed to:", myNFT.address);
  console.log("Transaction hash:", myNFT.deployTransaction.hash);
  
  // Save the contract address for frontend use
  console.log("\nCopy this contract address to use in your frontend:");
  console.log(myNFT.address);
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
