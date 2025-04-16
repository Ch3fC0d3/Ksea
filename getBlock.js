// getBlock.js - Fetch the latest block from Arbitrum One
import { JsonRpcProvider } from 'ethers';

// Connect to the Ethereum network (Arbitrum One)
const provider = new JsonRpcProvider("https://arb-mainnet.g.alchemy.com/v2/g_2WfKwm0xhgQ0v_-IaOnAD4-VUJqZD-");

(async () => {
  try {
    const blockNumber = "latest";
    const block = await provider.getBlock(blockNumber);
    console.log("Latest Block Information:");
    console.log("------------------------");
    console.log(`Block Number: ${block.number}`);
    console.log(`Block Hash: ${block.hash}`);
    console.log(`Parent Hash: ${block.parentHash}`);
    console.log(`Timestamp: ${new Date(block.timestamp * 1000).toLocaleString()}`);
    console.log(`Gas Limit: ${block.gasLimit.toString()}`);
    console.log(`Gas Used: ${block.gasUsed.toString()}`);
    console.log(`Miner/Validator: ${block.miner}`);
    console.log(`Transaction Count: ${block.transactions.length}`);
    console.log("------------------------");
    console.log("Full Block Data:");
    console.log(block);
  } catch (error) {
    console.error("Error fetching block:", error);
  }
})();
