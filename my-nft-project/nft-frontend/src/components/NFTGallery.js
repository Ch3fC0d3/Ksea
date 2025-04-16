import React, { useState, useEffect } from 'react';
import './NFTGallery.css';
import NFTCard from './NFTCard';
import { MOCK_NFTS, ENABLE_MOCK_MODE, FORCE_MOCK_MODE, resetMockNFTs } from '../utils/mockData';

const NFTGallery = ({ contract, account, refreshTrigger = 0 }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [networkReady, setNetworkReady] = useState(false);
  const [usingMockData, setUsingMockData] = useState(false);

  // Check if the network is ready before attempting to fetch NFTs
  useEffect(() => {
    const checkNetwork = async () => {
      // Always use mock data if FORCE_MOCK_MODE is enabled
      if (FORCE_MOCK_MODE) {
        if (process.env.NODE_ENV === 'development') {
          console.log('Force mock mode enabled. Using mock NFT data.');
        }
        setUsingMockData(true);
        setNfts(MOCK_NFTS);
        setLoading(false);
        return;
      }
      
      if (!contract || !account) {
        setLoading(false);
        return;
      }

      try {
        // Try a simple call to check if the contract is accessible
        await contract.provider.getNetwork();
        setNetworkReady(true);
      } catch (err) {
        console.error('Network not ready:', err);
        if (ENABLE_MOCK_MODE) {
          console.log('Using mock data due to network connectivity issues');
          setUsingMockData(true);
          setNfts(MOCK_NFTS);
          setLoading(false);
        } else {
          setError('Network connection issue. Please make sure your Hardhat node is running and you are connected to the correct network.');
          setNetworkReady(false);
          setLoading(false);
        }
      }
    };

    checkNetwork();
  }, [contract, account]);

  // Fetch NFTs owned by the connected account
  useEffect(() => {
    const fetchNFTs = async () => {
      // Always use mock data if FORCE_MOCK_MODE is enabled
      if (FORCE_MOCK_MODE && nfts.length === 0) {
        console.log('Force mock mode enabled. Using mock NFT data in fetchNFTs.');
        setUsingMockData(true);
        setNfts(MOCK_NFTS);
        setLoading(false);
        return;
      }
      
      // If we're using mock data or not ready, don't try to fetch from blockchain
      if (!contract || !account || !networkReady || usingMockData) {
        return;
      }

      try {
        setLoading(true);
        
        // Use a more robust approach to fetch NFTs
        // First check if we can access the contract at all
        try {
          // Get the total supply or another view function that doesn't require parameters
          await contract.name();
        } catch (contractErr) {
          console.error('Contract not accessible:', contractErr);
          if (ENABLE_MOCK_MODE) {
            console.log('Falling back to mock data due to contract access issues');
            setUsingMockData(true);
            setNfts(MOCK_NFTS);
            setLoading(false);
            return;
          } else {
            setError('Unable to access the NFT contract. Please check your connection and try again.');
            setLoading(false);
            return;
          }
        }
        
        // Now try to get the balance with proper error handling
        let balanceNumber = 0;
        try {
          const balance = await contract.balanceOf(account);
          balanceNumber = balance.toNumber();
        } catch (balanceErr) {
          console.error('Error getting balance:', balanceErr);
          if (ENABLE_MOCK_MODE) {
            console.log('Falling back to mock data due to balance fetch issues');
            setUsingMockData(true);
            setNfts(MOCK_NFTS);
            setLoading(false);
            return;
          }
          // Don't set error here, just assume balance is 0 and continue
        }
        
        // If balance is 0 and mock mode is enabled, use mock data
        if (balanceNumber === 0 && ENABLE_MOCK_MODE) {
          console.log('No NFTs found, using mock data for demonstration');
          setUsingMockData(true);
          setNfts(MOCK_NFTS);
          setLoading(false);
          return;
        }
        
        const nftData = [];
        let fetchError = false;
        
        // For each NFT, get the token ID and metadata
        // We'll try the first 5 token IDs to see if any exist
        for (let i = 0; i < 5; i++) {
          try {
            // Check if this token exists and is owned by the account
            let owner = null;
            try {
              owner = await contract.ownerOf(i);
            } catch (ownerErr) {
              // Token might not exist, just continue to the next one
              continue;
            }
            
            // Skip if this token isn't owned by the account
            if (owner.toLowerCase() !== account.toLowerCase()) continue;
            
            // Get the token URI
            let tokenURI = '';
            try {
              tokenURI = await contract.tokenURI(i);
            } catch (uriErr) {
              console.error(`Error getting URI for token ${i}:`, uriErr);
              tokenURI = `unknown-uri-${i}`;
              fetchError = true;
            }
            
            // For IPFS URIs, we need to fetch the metadata
            let metadata = {
              name: `NFT #${i}`,
              description: 'Loading metadata...',
              image: '',
              attributes: []
            };
            
            // In a real app, you would fetch the metadata from IPFS
            // For this demo, we'll use our local metadata
            if (tokenURI.includes('ipfs://') || true) { // Always use our demo metadata for now
              // Extract the token ID from the URI
              const tokenId = i + 1; // Adjust for our metadata files (1.json, 2.json, 3.json)
              
              // Simulate fetching from IPFS by using our local metadata
              try {
                // In a real app, you would fetch from IPFS gateway
                // For demo, we'll use hardcoded metadata
                if (tokenId === 1) {
                  metadata = {
                    name: "Cosmic Star #1",
                    description: "A geometric cosmic star pattern with vibrant colors on a dark background.",
                    image: "/nft1.svg", // Local path for demo
                    attributes: [
                      { trait_type: "Background", value: "Deep Space" },
                      { trait_type: "Shape", value: "Star" },
                      { trait_type: "Color Scheme", value: "Red & Blue" },
                      { trait_type: "Rarity", value: "Common" }
                    ]
                  };
                } else if (tokenId === 2) {
                  metadata = {
                    name: "Geometric Balance #2",
                    description: "A balanced composition featuring a square and circle in harmony.",
                    image: "/nft2.svg", // Local path for demo
                    attributes: [
                      { trait_type: "Background", value: "Dark Gray" },
                      { trait_type: "Shape", value: "Square & Circle" },
                      { trait_type: "Color Scheme", value: "Purple & Green" },
                      { trait_type: "Rarity", value: "Uncommon" }
                    ]
                  };
                } else if (tokenId === 3) {
                  metadata = {
                    name: "Pyramid Vision #3",
                    description: "A minimalist pyramid design with a watchful eye.",
                    image: "/nft3.svg", // Local path for demo
                    attributes: [
                      { trait_type: "Background", value: "Charcoal" },
                      { trait_type: "Shape", value: "Triangle & Circle" },
                      { trait_type: "Color Scheme", value: "Teal & White" },
                      { trait_type: "Rarity", value: "Rare" }
                    ]
                  };
                }
              } catch (metadataError) {
                console.error(`Error fetching metadata for token ${i}:`, metadataError);
                fetchError = true;
              }
            }
            
            nftData.push({
              id: i,
              tokenURI,
              metadata
            });
          } catch (tokenError) {
            console.error(`Error processing token ${i}:`, tokenError);
            fetchError = true;
            // Continue to the next token
          }
        }
        
        // If we had errors and got no NFTs, fall back to mock data
        if (fetchError && nftData.length === 0 && ENABLE_MOCK_MODE) {
          console.log('Errors occurred during fetch and no NFTs found, using mock data');
          setUsingMockData(true);
          setNfts(MOCK_NFTS);
        } else {
          setNfts(nftData);
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        if (ENABLE_MOCK_MODE) {
          console.log('Falling back to mock data due to general fetch error');
          setUsingMockData(true);
          setNfts(MOCK_NFTS);
        } else {
          setError('Failed to load your NFTs. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (networkReady && !usingMockData) {
      fetchNFTs();
    }
  }, [contract, account, usingMockData, refreshTrigger]);

  if (loading) {
    return <div className="loading">Loading your NFT collection...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button 
          className="retry-button" 
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="no-nfts">
        <h2>No NFTs Found</h2>
        <p>You don't own any NFTs from this collection yet.</p>
        {networkReady ? (
          <p className="help-text">If you're the contract owner, you can mint new NFTs below.</p>
        ) : (
          <p className="help-text">Please make sure you're connected to the correct network.</p>
        )}
      </div>
    );
  }

  // Function to handle resetting the gallery
  const handleReset = () => {
    resetMockNFTs();
    setNfts([...MOCK_NFTS]);
  };

  return (
    <div className="nft-gallery">
      <div className="gallery-header">
        <h2>NFT Gallery</h2>
        {usingMockData && (
          <button 
            className="reset-button" 
            onClick={handleReset}
            title="Reset gallery to initial state"
          >
            Reset Gallery
          </button>
        )}
      </div>
      {usingMockData && (
        <div className="mock-data-notice">
          <p>⚠️ Using demo data mode</p>
        </div>
      )}
      <div className="nft-grid">
        {nfts.map((nft) => (
          <NFTCard key={nft.id} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
