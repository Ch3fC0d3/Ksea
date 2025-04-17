require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

// Handle private key formatting
const getPrivateKey = () => {
  const privateKey = process.env.PRIVATE_KEY || "";
  return privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 31337
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [getPrivateKey()] : [],
      gasPrice: 35000000000
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts",
    cache: "./cache"
  }
};
