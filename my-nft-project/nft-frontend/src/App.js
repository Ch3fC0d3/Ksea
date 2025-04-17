import React, { useState, useEffect } from 'react';
// Import ethers with a specific version compatibility approach
import { ethers } from 'ethers';
import './App.css';
import ConnectWallet from './components/ConnectWallet';
import NFTGallery from './components/NFTGallery';
import MintNFT from './components/MintNFT';
import NetworkGuide from './components/NetworkGuide';
// Import contract configuration for Sepolia testnet
import contractConfig from './contractConfig';
import { ENABLE_MOCK_MODE, FORCE_MOCK_MODE, isMockOwner, MOCK_OWNER_ADDRESS } from './utils/mockData';

function App() {
  const [account, setAccount] = useState('');
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);
  const [chainId, setChainId] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [refreshGallery, setRefreshGallery] = useState(0);

  // Initialize ethers and contract when the component mounts
  useEffect(() => {
    const init = async () => {
      // If FORCE_MOCK_MODE is enabled, automatically use mock data without MetaMask
      if (FORCE_MOCK_MODE) {
        // Only log in development mode and not in production
        if (process.env.NODE_ENV === 'development' && !window.consoleLogShown) {
          console.log('Using mock data without MetaMask interaction.');
          window.consoleLogShown = true;
        }
        setAccount(MOCK_OWNER_ADDRESS);
        setIsOwner(true);
        setUsingMockData(true);
        setLoading(false);
        return;
      }
      try {
        // Check if MetaMask is installed
        if (window.ethereum && window.ethereum.isMetaMask) {
          // Create a new provider with a more compatible approach
          const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
          setProvider(provider);
          
          try {
            // Get current chain ID
            const network = await provider.getNetwork();
            setChainId(network.chainId);
            
            // Check if we're on the correct network (Sepolia = 11155111 or 0xaa36a7 in hex)
            if (network.chainId !== 11155111) {
              setNetworkError(true);
            } else {
              setNetworkError(false);
            }
            
            // Listen for account changes
            window.ethereum.on('accountsChanged', (accounts) => {
              setAccount(accounts[0] || '');
              if (accounts[0]) {
                checkOwner(accounts[0], provider);
              }
            });

            // Listen for chain changes
            window.ethereum.on('chainChanged', (chainIdHex) => {
              const newChainId = parseInt(chainIdHex, 16);
              setChainId(newChainId);
              setNetworkError(newChainId !== 11155111);
              
              // If we're on the correct network and have an account, reconnect
              if (newChainId === 11155111 && account) {
                reconnectContract(provider);
              }
            });
          } catch (err) {
            console.error('Error initializing provider:', err);
            setError('Failed to initialize provider: ' + (err.message || 'Unknown error'));
            
            // If mock mode is enabled, allow the app to work despite errors
            if (ENABLE_MOCK_MODE) {
              console.log('Error during initialization, but mock mode is enabled. Proceeding with limited functionality.');
              setUsingMockData(true);
            }
            setNetworkError(false);
          }
        } else {
          setError('Please install MetaMask to use this dApp. Other wallets are not supported.');
          
          // If mock mode is enabled, allow the app to work without MetaMask
          if (ENABLE_MOCK_MODE) {
            console.log('MetaMask not detected, but mock mode is enabled. Proceeding with limited functionality.');
            setUsingMockData(true);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to initialize the application');
        
        // If mock mode is enabled, allow the app to work despite errors
        if (ENABLE_MOCK_MODE) {
          console.log('Error during initialization, but mock mode is enabled. Proceeding with limited functionality.');
          setUsingMockData(true);
          setLoading(false);
        }
      } finally {
        if (!ENABLE_MOCK_MODE) {
          setLoading(false);
        }
      }
    };

    init();

    // Cleanup listeners when component unmounts
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  // Reconnect to contract after network change
  const reconnectContract = async (provider) => {
    try {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);
      setSigner(signer);
      setContract(contract);
      
      // Check if the connected account is the contract owner
      const address = await signer.getAddress();
      await checkOwner(address, provider);
    } catch (err) {
      console.error('Error reconnecting to contract:', err);
      
      // If mock mode is enabled, allow the app to work despite errors
      if (ENABLE_MOCK_MODE) {
        console.log('Error during reconnection, but mock mode is enabled.');
        setUsingMockData(true);
      }
    }
  };

  // Check if the connected account is the contract owner
  const checkOwner = async (address, provider) => {
    if (!address) return;
    
    // If using mock data, use the mock owner check
    if (usingMockData || ENABLE_MOCK_MODE) {
      setIsOwner(isMockOwner(address));
      return;
    }
    
    if (!provider) return;
    
    try {
      const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, provider);
      const contractOwner = await contract.owner();
      setIsOwner(address.toLowerCase() === contractOwner.toLowerCase());
    } catch (err) {
      console.error('Error checking owner:', err);
      
      // If mock mode is enabled, fall back to mock owner check
      if (ENABLE_MOCK_MODE) {
        console.log('Error checking owner, falling back to mock owner check');
        setIsOwner(isMockOwner(address));
        setUsingMockData(true);
      }
    }
  };

  // Connect wallet function - specifically targeting MetaMask
  const connectWallet = async () => {
    // If FORCE_MOCK_MODE is enabled, automatically use mock data without MetaMask
    if (FORCE_MOCK_MODE) {
      console.log('Force mock mode enabled. Using mock data without MetaMask interaction.');
      setAccount(MOCK_OWNER_ADDRESS);
      setIsOwner(true);
      setUsingMockData(true);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      // If mock mode is enabled and MetaMask is not available, use mock data
      if (ENABLE_MOCK_MODE && (!window.ethereum || !window.ethereum.isMetaMask)) {
        console.log('MetaMask not available, using mock data mode');
        // Generate a random mock address if needed
        const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        setAccount(mockAddress);
        setIsOwner(isMockOwner(mockAddress));
        setUsingMockData(true);
        setLoading(false);
        return;
      }
      
      // Direct MetaMask detection
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        setError('Please use MetaMask browser extension. Other wallets are not supported.');
        setLoading(false);
        return;
      }
      
      // Check network first with try-catch for better error handling
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
        const network = await provider.getNetwork();
        
        // If not on Hardhat network, show error but still allow connection
        if (network.chainId !== 31337) {
          setNetworkError(true);
          
          // If mock mode is enabled, allow the app to work on any network
          if (ENABLE_MOCK_MODE) {
            console.log('Not on Hardhat network, but mock mode is enabled. Proceeding with mock data.');
            setUsingMockData(true);
          }
        } else {
          setNetworkError(false);
        }
        
        // Request account access specifically from MetaMask with better error handling
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        
        setAccount(address);
        setProvider(provider);
        setSigner(signer);
        
        // Only create contract instance if on correct network
        if (network.chainId === 31337) {
          const contract = new ethers.Contract(contractConfig.address, contractConfig.abi, signer);
          setContract(contract);
          
          // Check if the connected account is the contract owner
          await checkOwner(address, provider);
        } else if (ENABLE_MOCK_MODE) {
          // If not on correct network but mock mode is enabled
          setIsOwner(isMockOwner(address));
        }
      } catch (err) {
        console.error('Error connecting wallet:', err);
        setError('Failed to connect MetaMask: ' + (err.message || 'Unknown error'));
        
        // If mock mode is enabled, allow the app to work despite connection errors
        if (ENABLE_MOCK_MODE) {
          console.log('Error connecting wallet, but mock mode is enabled. Using mock data.');
          const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
          setAccount(mockAddress);
          setIsOwner(isMockOwner(mockAddress));
          setUsingMockData(true);
        }
      }
    } catch (err) {
      console.error('Error in connectWallet:', err);
      setError('Failed to connect wallet: ' + (err.message || 'Unknown error'));
      
      // If mock mode is enabled, allow the app to work despite errors
      if (ENABLE_MOCK_MODE) {
        console.log('Error in wallet connection, but mock mode is enabled. Using mock data.');
        const mockAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
        setAccount(mockAddress);
        setIsOwner(isMockOwner(mockAddress));
        setUsingMockData(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Geometric Cosmos NFT Gallery</h1>
        <ConnectWallet 
          account={account} 
          connectWallet={connectWallet} 
          loading={loading} 
        />
      </header>

      {error && <div className="error-message">{error}</div>}
      
      {networkError && !usingMockData && (
        <div className="network-error">
          <p>⚠️ You are not connected to the Hardhat local network (Chain ID: 31337)</p>
          <p>Please switch to the Hardhat network in MetaMask to interact with this application.</p>
        </div>
      )}
      
      {usingMockData && (
        <div className="demo-mode-banner">
          <p>🔍 Demo Mode: Using sample data for demonstration purposes</p>
          <p className="demo-note">Blockchain connection not available or not required</p>
        </div>
      )}

      <main>
        {account ? (
          networkError && !usingMockData ? (
            <NetworkGuide />
          ) : (
            <>
              <NFTGallery 
                contract={contract} 
                account={account}
                refreshTrigger={refreshGallery}
              />
              
              {isOwner && (
                <MintNFT 
                  contract={contract} 
                  account={account}
                  onMint={() => setRefreshGallery(prev => prev + 1)}
                />
              )}
            </>
          )
        ) : (
          <div className="connect-prompt">
            <p>Connect your MetaMask wallet to view and interact with the NFT collection</p>
            <p className="metamask-note">⚠️ Important: This app only works with MetaMask. Please make sure you have the MetaMask extension installed and active.</p>
            <NetworkGuide />
          </div>
        )}
      </main>

      <footer>
        <p>© 2025 Geometric Cosmos NFT Collection</p>
      </footer>
    </div>
  );
}

export default App;
