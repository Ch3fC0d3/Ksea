/**
 * Mock NFT data for development and testing
 * This allows the application to function even when blockchain connectivity fails
 */

// Original NFT data that we can reset to
const ORIGINAL_NFTS = [
  {
    id: 0,
    tokenURI: "ipfs://QmXxvxzZmFiuTRxM5AXEXcGmvJNK2qNdPNvpNFUaqQ5dQi/1",
    metadata: {
      name: "Cosmic Star #1",
      description: "A geometric cosmic star pattern with vibrant colors on a dark background.",
      image: "/nft1.svg", // Local path for demo
      attributes: [
        { trait_type: "Background", value: "Deep Space" },
        { trait_type: "Shape", value: "Star" },
        { trait_type: "Color Scheme", value: "Red & Blue" },
        { trait_type: "Rarity", value: "Common" }
      ]
    }
  }
];

// Export a mutable array that can be modified
export const MOCK_NFTS = [...ORIGINAL_NFTS];

// Function to reset the mock NFTs to the original state
export const resetMockNFTs = () => {
  // Clear the array
  MOCK_NFTS.length = 0;
  
  // Add back the original NFTs
  ORIGINAL_NFTS.forEach(nft => MOCK_NFTS.push({...nft}));
  
  return MOCK_NFTS;
};

// Mock contract owner address
export const MOCK_OWNER_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

// Helper function to check if an address is the mock owner
export const isMockOwner = (address) => {
  return address && address.toLowerCase() === MOCK_OWNER_ADDRESS.toLowerCase();
};

// Flag to enable/disable mock mode - ALWAYS ENABLED for development
export const ENABLE_MOCK_MODE = true;

// Force mock mode without requiring MetaMask
export const FORCE_MOCK_MODE = true;
