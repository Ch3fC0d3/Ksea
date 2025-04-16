import React, { useState } from 'react';
import './MintNFT.css';
import { FORCE_MOCK_MODE, MOCK_NFTS } from '../utils/mockData';
import { generateDeterministicNFT } from '../utils/nftGenerator';

const MintNFT = ({ contract, account, onMint }) => {
  const [recipient, setRecipient] = useState('');
  const [metadataURI, setMetadataURI] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Predefined metadata templates
  const templates = [
    { 
      id: 'template1', 
      name: 'Cosmic Star #4', 
      uri: 'ipfs://QmNft1/4.json'
    },
    { 
      id: 'template2', 
      name: 'Geometric Balance #5', 
      uri: 'ipfs://QmNft1/5.json'
    },
    { 
      id: 'template3', 
      name: 'Pyramid Vision #6', 
      uri: 'ipfs://QmNft1/6.json'
    }
  ];

  // Handle template selection
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    
    if (templateId) {
      const template = templates.find(t => t.id === templateId);
      setMetadataURI(template.uri);
    } else {
      setMetadataURI('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    
    // Validate form
    if (!recipient) {
      setError('Please enter a recipient address');
      return;
    }
    
    if (!metadataURI) {
      setError('Please enter a metadata URI or select a template');
      return;
    }
    
    try {
      setLoading(true);
      
      // Generate deterministic NFT based on recipient address and template
      const timestamp = Date.now();
      const seed = recipient + selectedTemplate + timestamp;
      const nftData = generateDeterministicNFT(seed);
      
      // Only log in development mode
      if (process.env.NODE_ENV === 'development') {
        console.debug('Generated deterministic NFT:', nftData);
      }
      
      // Check if we're in mock mode or if contract is null
      if (FORCE_MOCK_MODE || !contract) {
        // Simulate minting with mock data
        if (process.env.NODE_ENV === 'development') {
          console.debug('Using mock minting function');
        }
        
        // Simulate blockchain delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a deterministic transaction hash based on the seed
        const hashBase = seed.split('').map(c => c.charCodeAt(0).toString(16)).join('');
        const mockTxHash = '0x' + hashBase.padEnd(64, '0').substring(0, 64);
        
        // Create a new NFT object with the deterministic data
        const newNftId = MOCK_NFTS.length;
        const newNft = {
          id: newNftId,
          tokenURI: `ipfs://QmMockNFT/${newNftId}`,
          metadata: {
            ...nftData,
            owner: recipient
          }
        };
        
        // Add the new NFT to the mock data
        MOCK_NFTS.push(newNft);
        
        // Notify parent component about the new NFT
        if (onMint) {
          onMint(newNft);
        }
          
        // Show success message with mock transaction hash
        setSuccess(`NFT minted successfully in demo mode! Mock transaction hash: ${mockTxHash}`);
      } else {
        // Call the real contract's safeMint function with the deterministic metadata
        const tx = await contract.safeMint(recipient, metadataURI, nftData);
        
        // Wait for the transaction to be mined
        await tx.wait();
        
        // Show success message
        setSuccess(`NFT minted successfully! Transaction hash: ${tx.hash}`);
      }
      
      // Reset form
      setRecipient('');
      setMetadataURI('');
      setSelectedTemplate('');
    } catch (err) {
      console.error('Error minting NFT:', err);
      setError(err.message || 'Failed to mint NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mint-nft">
      <h2>Mint New NFT</h2>
      <p className="admin-notice">As the contract owner, you can mint new NFTs to any address.</p>
      
      {error && <div className="mint-error">{error}</div>}
      {success && <div className="mint-success">{success}</div>}
      
      <form onSubmit={handleSubmit} className="mint-form">
        <div className="form-group">
          <label htmlFor="recipient">Recipient Address</label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            disabled={loading}
          />
          <button 
            type="button" 
            className="self-address-btn"
            onClick={() => setRecipient(account)}
            disabled={loading}
          >
            Use My Address
          </button>
        </div>
        
        <div className="form-group">
          <label htmlFor="template">Select NFT Template</label>
          <select
            id="template"
            value={selectedTemplate}
            onChange={handleTemplateChange}
            disabled={loading}
          >
            <option value="">-- Select a template --</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="metadataURI">Metadata URI</label>
          <input
            type="text"
            id="metadataURI"
            value={metadataURI}
            onChange={(e) => setMetadataURI(e.target.value)}
            placeholder="ipfs://..."
            disabled={loading}
          />
          <small className="form-help">
            Enter the IPFS URI for your NFT metadata JSON file
          </small>
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary mint-btn"
          disabled={loading}
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </button>
      </form>
    </div>
  );
};

export default MintNFT;
