// scripts/mint.js
const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [owner] = await ethers.getSigners();
  
  // Use the deployed contract address
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  // Get the contract instance
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const myNFT = await MyNFT.attach(contractAddress);
  
  console.log("Minting NFTs from:", owner.address);
  
  // Get metadata files
  const metadataDir = path.join(__dirname, '..', 'metadata');
  const metadataFiles = fs.readdirSync(metadataDir)
    .filter(file => file.endsWith('.json') && !file.includes('collection'))
    .sort((a, b) => parseInt(a) - parseInt(b));
  
  console.log(`Found ${metadataFiles.length} metadata files to mint`);
  
  // Mint each NFT
  for (const file of metadataFiles) {
    const filePath = path.join(metadataDir, file);
    const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    console.log(`\nMinting "${metadata.name}"...`);
    
    // Use the IPFS URI from our metadata
    const metadataURI = `ipfs://QmNft1/${file}`;
    
    try {
      const mintTx = await myNFT.safeMint(owner.address, metadataURI);
      await mintTx.wait();
      
      console.log(`✅ NFT minted successfully!`);
      console.log(`Transaction hash: ${mintTx.hash}`);
      
      // Get the token ID (assuming sequential minting starting from 0)
      const tokenId = parseInt(file) - 1;
      const tokenURI = await myNFT.tokenURI(tokenId);
      console.log(`Token URI for token ID ${tokenId}: ${tokenURI}`);
    } catch (error) {
      console.error(`❌ Error minting "${metadata.name}":`, error.message);
    }
  }
  
  console.log("\n🎉 All NFTs minted successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
