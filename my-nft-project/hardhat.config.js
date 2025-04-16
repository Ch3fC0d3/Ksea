require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    arbitrum: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY.startsWith('0x') ? process.env.PRIVATE_KEY : `0x${process.env.PRIVATE_KEY}`]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};
