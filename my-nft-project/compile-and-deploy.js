// compile-and-deploy.js - Compile and deploy NFT contract to Sepolia
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const solc = require('solc');
const ethers = require('ethers');

async function main() {
  try {
    console.log('Compiling contract...');
    
    // Read the contract source
    const contractPath = path.join(__dirname, 'contracts', 'MyNFT.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');
    
    // Prepare input for solc compiler
    const input = {
      language: 'Solidity',
      sources: {
        'MyNFT.sol': {
          content: contractSource
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['abi', 'evm.bytecode']
          }
        }
      }
    };
    
    // Compile the contract
    console.log('Compiling MyNFT.sol...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));
    
    // Check for compilation errors
    if (output.errors) {
      output.errors.forEach(error => {
        console.error(error.formattedMessage);
      });
      
      if (output.errors.some(error => error.severity === 'error')) {
        throw new Error('Compilation failed');
      }
    }
    
    // Get the compiled contract
    const contract = output.contracts['MyNFT.sol'].MyNFT;
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;
    
    console.log('Contract compiled successfully');
    
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
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    
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
    
    // Save the contract address and ABI to a file for frontend integration
    const deploymentInfo = {
      address: contract.address,
      abi: abi,
      network: 'sepolia',
      deployedAt: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(__dirname, 'contract-deployment.json'),
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log('\nContract address and ABI saved to contract-deployment.json');
    
  } catch (error) {
    console.error('Error during compilation or deployment:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
