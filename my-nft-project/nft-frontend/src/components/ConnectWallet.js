import React from 'react';
import './ConnectWallet.css';

const ConnectWallet = ({ account, connectWallet, loading }) => {
  // Format the account address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="connect-wallet">
      {account ? (
        <div className="wallet-info">
          <span className="wallet-address">{formatAddress(account)}</span>
          <span className="wallet-status connected">Connected</span>
        </div>
      ) : (
        <button 
          className="btn btn-primary connect-btn" 
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect MetaMask'}
        </button>
      )}
    </div>
  );
};

export default ConnectWallet;
