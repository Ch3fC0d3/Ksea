// deploy-direct.js - Direct deployment script using ethers.js
require('dotenv').config();
const ethers = require('ethers');
const fs = require('fs');
const path = require('path');

// Read the contract source and compile it on the fly
const contractPath = path.join(__dirname, 'contracts', 'MyNFT.sol');
const contractSource = fs.readFileSync(contractPath, 'utf8');

// Read the compiled ABI from the artifacts directory
const abiPath = path.join(__dirname, 'abi.json');
const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));

async function main() {
  try {
    // Connect to the Sepolia network
    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    
    // Create a wallet from the private key
    const privateKey = process.env.PRIVATE_KEY.startsWith('0x') 
      ? process.env.PRIVATE_KEY 
      : `0x${process.env.PRIVATE_KEY}`;
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log(`Connected to Sepolia with address: ${wallet.address}`);
    
    // Get the wallet balance to ensure we have funds for deployment
    const balance = await wallet.getBalance();
    console.log(`Wallet balance: ${ethers.utils.formatEther(balance)} ETH`);
    
    if (balance.eq(0)) {
      console.error('Error: Your wallet has 0 ETH. Please fund it with Sepolia ETH before deploying.');
      process.exit(1);
    }
    
    // Create a factory for the NFT contract
    const factory = new ethers.ContractFactory(
      contractABI.abi, 
      contractABI.bytecode, 
      wallet
    );
    
    console.log('Deploying MyNFT contract to Sepolia...');
    
    // Deploy the contract
    const contract = await factory.deploy();
    
    console.log(`Transaction hash: ${contract.deployTransaction.hash}`);
    console.log('Waiting for deployment confirmation...');
    
    // Wait for the contract to be deployed
    await contract.deployed();
    
    console.log(`MyNFT contract deployed to: ${contract.address}`);
    console.log('\nSave this contract address for your frontend integration:');
    console.log(contract.address);
    
    // Save the contract address to a file for easy reference
    fs.writeFileSync(
      path.join(__dirname, 'contract-address.txt'),
      `Contract Address: ${contract.address}\nDeployed at: ${new Date().toISOString()}\nNetwork: Sepolia`
    );
    
    console.log('\nContract address saved to contract-address.txt');
    
  } catch (error) {
    console.error('Error during deployment:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
