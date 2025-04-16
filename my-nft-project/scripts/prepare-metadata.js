// scripts/prepare-metadata.js
const fs = require('fs');
const path = require('path');

// Simulates uploading to IPFS and returns CIDs
function simulateIPFSUpload() {
  const metadataDir = path.join(__dirname, '..', 'metadata');
  const baseURI = 'ipfs://QmNft1';
  
  console.log('🚀 Preparing NFT metadata for IPFS...');
  
  // Read all metadata files
  const metadataFiles = fs.readdirSync(metadataDir)
    .filter(file => file.endsWith('.json'))
    .filter(file => !file.includes('collection'));
  
  console.log(`Found ${metadataFiles.length} metadata files`);
  
  // Process each metadata file
  metadataFiles.forEach(file => {
    const filePath = path.join(metadataDir, file);
    const metadata = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Update image URL to use our simulated IPFS CID
    if (metadata.image && metadata.image.includes('ipfs://')) {
      console.log(`✅ Metadata for "${metadata.name}" is ready with image: ${metadata.image}`);
    } else {
      const imageFileName = `nft${path.parse(file).name}.svg`;
      metadata.image = `${baseURI}/images/${imageFileName}`;
      
      // Write updated metadata back to file
      fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
      console.log(`✅ Updated metadata for "${metadata.name}" with image: ${metadata.image}`);
    }
  });
  
  // Generate the base URI for the contract
  console.log('\n📝 Use this baseURI in your contract or minting script:');
  console.log(`${baseURI}/`);
  
  // Instructions for real IPFS upload
  console.log('\n📋 In a real project, you would:');
  console.log('1. Upload the "metadata" folder to IPFS using Pinata, NFT.Storage, or IPFS Desktop');
  console.log('2. Replace the "QmNft1" CID with the actual CID you receive after uploading');
  console.log('3. Use the real IPFS URI in your contract or minting script');
}

// Run the simulation
simulateIPFSUpload();
