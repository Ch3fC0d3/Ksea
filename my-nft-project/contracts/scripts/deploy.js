const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  
  // Deploy the contract
  console.log("Deploying MyNFT contract...");
  const myNFT = await MyNFT.deploy();
  
  // Wait for deployment to finish
  await myNFT.waitForDeployment();
  
  console.log("MyNFT deployed to:", await myNFT.getAddress());
}

// Run the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
