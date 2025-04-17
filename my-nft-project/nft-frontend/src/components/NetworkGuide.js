import React from 'react';
import './NetworkGuide.css';
import contractConfig from '../contractConfig';

const NetworkGuide = () => {
  // Function to add Sepolia testnet to MetaMask
  const addSepoliaNetwork = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      // First try to switch to the network if it already exists
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // 11155111 in hexadecimal (Sepolia)
        });
        alert('Successfully connected to Sepolia testnet!');
        return;
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902 || switchError.message.includes('wallet_addEthereumChain')) {
          // If the network doesn't exist, add it
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7', // 11155111 in hexadecimal (Sepolia)
                  chainName: 'Sepolia Testnet',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: [contractConfig.network.rpcUrl, 'https://rpc.sepolia.org'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
            
            // Try to switch to the newly added network
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }],
              });
              alert('Successfully added and connected to Sepolia testnet!');
            } catch (finalSwitchError) {
              console.error('Error switching to network after adding:', finalSwitchError);
              alert('Network was added but could not automatically switch. Please switch manually in MetaMask.');
            }
          } catch (addError) {
            console.error('Error adding network:', addError);
            alert('Failed to add Sepolia network. Please try adding it manually in MetaMask.');
          }
        } else {
          // Unknown error
          console.error('Error switching network:', switchError);
          alert('Failed to switch to Sepolia network. Please try manually or check the console for details.');
        }
      }
    } catch (error) {
      console.error('Error in network setup:', error);
      alert('Failed to set up Sepolia network. Please try manually or check the console for details.');
    }
  };

  // Function to get Sepolia testnet ETH
  const getSepoliaEth = () => {
    window.open('https://sepoliafaucet.com/', '_blank');
  };

  return (
    <div className="network-guide">
      <h2>Connection Guide</h2>
      <p className="guide-intro">
        To use this NFT Gallery, you need to connect MetaMask to the Sepolia testnet.
        Follow these steps:
      </p>
      
      <div className="guide-step">
        <h3>Step 1: Add Sepolia Testnet to MetaMask</h3>
        <p>Click the button below to automatically add the Sepolia testnet to your MetaMask:</p>
        <button className="guide-button" onClick={addSepoliaNetwork}>
          Add Sepolia Network
        </button>
        <p className="guide-note">
          If the automatic setup fails, you can manually add a network with these details:
        </p>
        <div className="network-details">
          <div className="detail-row">
            <span className="detail-label">Network Name:</span>
            <span className="detail-value">Sepolia Testnet</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">RPC URL:</span>
            <span className="detail-value">{contractConfig.network.rpcUrl}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Chain ID:</span>
            <span className="detail-value">11155111 (0xaa36a7 in hex)</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Currency Symbol:</span>
            <span className="detail-value">ETH</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Block Explorer:</span>
            <span className="detail-value">https://sepolia.etherscan.io</span>
          </div>
        </div>
      </div>
      
      <div className="guide-step">
        <h3>Step 2: Get Sepolia Testnet ETH</h3>
        <p>
          You'll need some Sepolia testnet ETH to interact with the NFT contract:
        </p>
        <button className="guide-button" onClick={getSepoliaEth}>
          Get Sepolia ETH
        </button>
        <p className="guide-note">
          On the faucet website:
        </p>
        <ol className="guide-list">
          <li>Connect your MetaMask wallet</li>
          <li>Request testnet ETH (it's free)</li>
          <li>Wait for the transaction to complete</li>
        </ol>
        <p className="guide-warning">
          ⚠️ IMPORTANT: This is test ETH with no real value. It can only be used on the Sepolia testnet.
        </p>
      </div>
      
      <div className="guide-step">
        <h3>Step 3: Connect Your Wallet</h3>
        <p>
          After getting Sepolia ETH:
        </p>
        <ol className="guide-list">
          <li>Make sure you're connected to the Sepolia network in MetaMask</li>
          <li>Click "Connect MetaMask" in the header</li>
          <li>You can now view and interact with the NFT contract</li>
        </ol>
        <p>
          The NFT contract is deployed at: <code>{contractConfig.address}</code>
        </p>
      </div>
    </div>
  );
};

export default NetworkGuide;
