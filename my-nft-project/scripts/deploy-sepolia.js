// scripts/deploy-sepolia.js
const hre = require("hardhat");

async function main() {
  console.log("Deploying MyNFT contract to Sepolia testnet...");

  // Get the contract factory
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  
  // Deploy the contract
  const myNFT = await MyNFT.deploy();
  
  // Wait for deployment to finish
  await myNFT.deployed();
  
  console.log("MyNFT deployed to:", myNFT.address);
  console.log("Transaction hash:", myNFT.deployTransaction.hash);
  
  // Save the contract address and network for frontend use
  console.log("\n---------------------------------------------");
  console.log("SAVE THIS INFORMATION FOR YOUR FRONTEND:");
  console.log("Contract Address:", myNFT.address);
  console.log("Network: Sepolia");
  console.log("---------------------------------------------\n");
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error);
    process.exit(1);
  });
