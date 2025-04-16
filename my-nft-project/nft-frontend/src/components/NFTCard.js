import React from 'react';
import './NFTCard.css';
import { generateCSS } from '../utils/nftGenerator';

// Geometric NFT shape components
const GeometricNFT1 = () => (
  <div className="geometric-nft" style={{ backgroundColor: '#1a1a2e' }}>
    <div className="geo-circle" style={{ backgroundColor: '#0f3460' }}></div>
    <div className="geo-star" style={{ borderBottomColor: '#e94560' }}></div>
    <div className="geo-inner-circle" style={{ backgroundColor: '#16213e', border: '5px solid #e94560' }}></div>
  </div>
);

const GeometricNFT2 = () => (
  <div className="geometric-nft" style={{ backgroundColor: '#1a1a2e' }}>
    <div className="geo-square" style={{ backgroundColor: '#0f3460' }}></div>
    <div className="geo-circle" style={{ backgroundColor: '#16213e', border: '5px solid #e94560' }}></div>
    <div className="geo-inner-square" style={{ backgroundColor: '#e94560' }}></div>
  </div>
);

const GeometricNFT3 = () => (
  <div className="geometric-nft" style={{ backgroundColor: '#1a1a2e' }}>
    <div className="geo-triangle" style={{ borderBottomColor: '#0f3460' }}></div>
    <div className="geo-circle" style={{ backgroundColor: '#16213e', border: '5px solid #e94560' }}></div>
    <div className="geo-inner-triangle" style={{ borderBottomColor: '#e94560' }}></div>
  </div>
);

const NFTCard = ({ nft }) => {
  const { id, metadata } = nft;
  
  // Function to render attributes
  const renderAttributes = (attributes) => {
    if (!attributes || attributes.length === 0) return null;
    
    return (
      <div className="nft-attributes">
        {attributes.map((attr, index) => (
          <div key={index} className="nft-attribute">
            <span className="attribute-type">{attr.trait_type}</span>
            <span className="attribute-value">{attr.value}</span>
          </div>
        ))}
      </div>
    );
  };

  // Function to render the appropriate NFT content based on the ID and metadata
  const renderNFTContent = (id, metadata) => {
    // Check if this is the p5.js sketch NFT
    if (metadata.image && metadata.image.endsWith('.html')) {
      return (
        <iframe 
          src={metadata.image} 
          title={metadata.name}
          className="p5-iframe"
          sandbox="allow-scripts"
          loading="lazy"
        />
      );
    }
    
    // Check if this is a deterministic NFT with design data
    if (metadata.design) {
      return <DeterministicNFT design={metadata.design} />;
    }
    
    // Otherwise render geometric NFTs
    // Use modulo to ensure we always have a valid shape even if id is out of range
    const nftId = id % 3;
    
    switch(nftId) {
      case 0:
        return <GeometricNFT1 />;
      case 1:
        return <GeometricNFT2 />;
      case 2:
        return <GeometricNFT3 />;
      default:
        return <GeometricNFT1 />;
    }
  };
  
  // Component to render a deterministic NFT with just color customization
  const DeterministicNFT = ({ design }) => {
    const { primaryColor, secondaryColor, accentColor } = design;
    
    // Use the first NFT design but with deterministic colors
    return (
      <div className="geometric-nft" style={{ backgroundColor: primaryColor }}>
        <div className="geo-circle" style={{ backgroundColor: secondaryColor }}></div>
        <div className="geo-star" style={{ borderBottomColor: accentColor }}></div>
        <div className="geo-inner-circle" style={{ backgroundColor: primaryColor, border: `5px solid ${accentColor}` }}></div>
      </div>
    );
  };

  return (
    <div className="nft-card">
      <div className="nft-image-container">
        {renderNFTContent(id, metadata)}
        <div className="nft-overlay">
          <span className="nft-view">View Details</span>
        </div>
      </div>
      <div className="nft-details">
        <h3 className="nft-title">{metadata.name}</h3>
        <p className="nft-description">{metadata.description}</p>
        <div className="nft-id">Token ID: {id}</div>
        {renderAttributes(metadata.attributes)}
      </div>
    </div>
  );
};

export default NFTCard;
