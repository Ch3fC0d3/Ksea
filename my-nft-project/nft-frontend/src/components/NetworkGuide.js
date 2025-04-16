import React from 'react';
import './NetworkGuide.css';

const NetworkGuide = () => {
  // Function to add Hardhat network to MetaMask
  const addHardhatNetwork = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      // First try to switch to the network if it already exists
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7A69' }], // 31337 in hexadecimal
        });
        alert('Successfully connected to Hardhat Local network!');
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
                  chainId: '0x7A69', // 31337 in hexadecimal
                  chainName: 'Hardhat Local',
                  nativeCurrency: {
                    name: 'Ethereum',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['http://127.0.0.1:8545/'],
                  blockExplorerUrls: [],
                },
              ],
            });
            
            // Try to switch to the newly added network
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7A69' }],
              });
              alert('Successfully added and connected to Hardhat Local network!');
            } catch (finalSwitchError) {
              console.error('Error switching to network after adding:', finalSwitchError);
              alert('Network was added but could not automatically switch. Please switch manually in MetaMask.');
            }
          } catch (addError) {
            console.error('Error adding network:', addError);
            alert('Failed to add Hardhat network. Please try adding it manually in MetaMask.');
          }
        } else {
          // Unknown error
          console.error('Error switching network:', switchError);
          alert('Failed to switch to Hardhat network. Please try manually or check the console for details.');
        }
      }
    } catch (error) {
      console.error('Error in network setup:', error);
      alert('Failed to set up Hardhat network. Please try manually or check the console for details.');
    }
  };

  // Function to copy the private key to clipboard
  const copyPrivateKey = () => {
    const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
    navigator.clipboard.writeText(privateKey);
    alert('Private key copied to clipboard! You can now import this account in MetaMask.');
  };

  return (
    <div className="network-guide">
      <h2>Connection Guide</h2>
      <p className="guide-intro">
        To use this NFT Gallery, you need to connect MetaMask to your local Hardhat network.
        Follow these steps:
      </p>
      
      <div className="guide-step">
        <h3>Step 1: Add Hardhat Network to MetaMask</h3>
        <p>Click the button below to automatically add the Hardhat network to your MetaMask:</p>
        <button className="guide-button" onClick={addHardhatNetwork}>
          Add Hardhat Network
        </button>
        <p className="guide-note">
          If the automatic setup fails, you can manually add a network with these details:
        </p>
        <div className="network-details">
          <div className="detail-row">
            <span className="detail-label">Network Name:</span>
            <span className="detail-value">Hardhat Local</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">RPC URL:</span>
            <span className="detail-value">http://127.0.0.1:8545/</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Chain ID:</span>
            <span className="detail-value">31337</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Currency Symbol:</span>
            <span className="detail-value">ETH</span>
          </div>
        </div>
      </div>
      
      <div className="guide-step">
        <h3>Step 2: Import the Contract Owner Account</h3>
        <p>
          To interact with your NFT contract as the owner, import the first Hardhat test account:
        </p>
        <button className="guide-button" onClick={copyPrivateKey}>
          Copy Private Key
        </button>
        <p className="guide-note">
          Then in MetaMask:
        </p>
        <ol className="guide-list">
          <li>Click on your account icon</li>
          <li>Select "Import Account"</li>
          <li>Paste the private key and click "Import"</li>
        </ol>
        <p className="guide-warning">
          ⚠️ IMPORTANT: This is a test account with test ETH. Never use it on mainnet or with real funds!
        </p>
      </div>
      
      <div className="guide-step">
        <h3>Step 3: Refresh and Connect</h3>
        <p>
          After completing the steps above:
        </p>
        <ol className="guide-list">
          <li>Refresh this page</li>
          <li>Click "Connect MetaMask" in the header</li>
          <li>You should now be able to view and mint NFTs</li>
        </ol>
      </div>
    </div>
  );
};

export default NetworkGuide;
