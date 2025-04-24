// Enhanced wallet management script for KSEA NFT project
document.addEventListener('DOMContentLoaded', function() {
  // Create wallet selector modal
  function createWalletModal() {
    // Check if modal already exists
    if (document.getElementById('wallet-modal')) {
      return document.getElementById('wallet-modal');
    }
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'wallet-modal';
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.zIndex = '10000';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.borderRadius = '8px';
    modalContent.style.padding = '20px';
    modalContent.style.width = '90%';
    modalContent.style.maxWidth = '400px';
    modalContent.style.color = '#333';
    modalContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    
    // Add title
    const title = document.createElement('h3');
    title.textContent = 'Connect Wallet';
    title.style.margin = '0 0 20px 0';
    title.style.textAlign = 'center';
    title.style.color = '#6c5ce7';
    modalContent.appendChild(title);
    
    // Add wallet options
    const walletOptions = [
      { name: 'MetaMask', icon: '🦊' },
      { name: 'Coinbase Wallet', icon: '🔵' },
      { name: 'WalletConnect', icon: '🔗' },
      { name: 'Trust Wallet', icon: '🛡️' }
    ];
    
    walletOptions.forEach(wallet => {
      const option = document.createElement('div');
      option.className = 'wallet-option';
      option.style.display = 'flex';
      option.style.alignItems = 'center';
      option.style.padding = '12px 15px';
      option.style.margin = '10px 0';
      option.style.borderRadius = '6px';
      option.style.backgroundColor = '#f8f9fa';
      option.style.cursor = 'pointer';
      option.style.transition = 'all 0.2s ease';
      
      // Add icon
      const icon = document.createElement('span');
      icon.textContent = wallet.icon;
      icon.style.fontSize = '24px';
      icon.style.marginRight = '15px';
      option.appendChild(icon);
      
      // Add name
      const name = document.createElement('span');
      name.textContent = wallet.name;
      name.style.fontWeight = '500';
      option.appendChild(name);
      
      // Add hover effect
      option.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#eaecef';
        this.style.transform = 'translateY(-2px)';
      });
      
      option.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#f8f9fa';
        this.style.transform = 'none';
      });
      
      // Add click handler
      option.addEventListener('click', function() {
        if (wallet.name === 'MetaMask') {
          // Trigger MetaMask connection
          if (window.ethereum && window.ethereum.isMetaMask) {
            // Close modal
            modal.style.display = 'none';
            
            // Trigger the connect button click if it exists
            const connectBtn = document.querySelector('.connect-btn');
            if (connectBtn) {
              connectBtn.click();
            } else {
              // Fallback: reload the page
              window.location.reload();
            }
          } else {
            // MetaMask not installed
            alert('MetaMask is not installed. Please install MetaMask to continue.');
          }
        } else {
          // For other wallets, show coming soon message
          alert(`${wallet.name} integration coming soon!`);
        }
      });
      
      modalContent.appendChild(option);
    });
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.display = 'block';
    closeBtn.style.width = '100%';
    closeBtn.style.padding = '10px';
    closeBtn.style.marginTop = '20px';
    closeBtn.style.backgroundColor = '#e0e0e0';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontWeight = '500';
    
    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    
    modalContent.appendChild(closeBtn);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    return modal;
  }
  
  // Function to add disconnect functionality
  function addWalletDisconnect() {
    // Find wallet info elements (they have the class 'wallet-info')
    const walletInfoElements = document.querySelectorAll('.wallet-info');
    
    if (walletInfoElements.length > 0) {
      walletInfoElements.forEach(walletInfo => {
        // Make it look clickable
        walletInfo.style.cursor = 'pointer';
        walletInfo.style.transition = 'all 0.2s ease';
        
        // Add hover effect
        walletInfo.addEventListener('mouseenter', function() {
          this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
          this.style.transform = 'translateY(-2px)';
          
          // Add disconnect hint if it doesn't exist
          if (!this.querySelector('.disconnect-hint')) {
            const hint = document.createElement('span');
            hint.className = 'disconnect-hint';
            hint.textContent = 'Click to disconnect';
            hint.style.position = 'absolute';
            hint.style.bottom = '-20px';
            hint.style.left = '50%';
            hint.style.transform = 'translateX(-50%)';
            hint.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            hint.style.color = 'white';
            hint.style.fontSize = '0.7rem';
            hint.style.padding = '2px 8px';
            hint.style.borderRadius = '4px';
            hint.style.whiteSpace = 'nowrap';
            hint.style.zIndex = '1000';
            this.style.position = 'relative';
            this.appendChild(hint);
          } else {
            this.querySelector('.disconnect-hint').style.display = 'block';
          }
        });
        
        // Remove hover effect
        walletInfo.addEventListener('mouseleave', function() {
          this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
          this.style.transform = 'none';
          
          // Hide disconnect hint
          const hint = this.querySelector('.disconnect-hint');
          if (hint) {
            hint.style.display = 'none';
          }
        });
        
        // Add click handler for disconnect
        walletInfo.addEventListener('click', function() {
          // Clear localStorage items related to wallet connection
          localStorage.removeItem('walletConnected');
          localStorage.removeItem('walletAddress');
          
          // Show wallet selection modal
          const modal = createWalletModal();
          modal.style.display = 'flex';
          
          // Show a brief notification
          const notification = document.createElement('div');
          notification.textContent = 'Wallet disconnected successfully';
          notification.style.position = 'fixed';
          notification.style.top = '20px';
          notification.style.left = '50%';
          notification.style.transform = 'translateX(-50%)';
          notification.style.backgroundColor = '#4caf50';
          notification.style.color = 'white';
          notification.style.padding = '10px 20px';
          notification.style.borderRadius = '4px';
          notification.style.zIndex = '10001';
          document.body.appendChild(notification);
          
          // Remove notification after 3 seconds
          setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
              document.body.removeChild(notification);
            }, 500);
          }, 3000);
        });
      });
    }
    
    // Also handle the connect button to show wallet options
    const connectButtons = document.querySelectorAll('.connect-btn');
    if (connectButtons.length > 0) {
      connectButtons.forEach(button => {
        // Replace the default click handler
        button.addEventListener('click', function(e) {
          // Prevent default action
          e.stopPropagation();
          
          // Show wallet selection modal
          const modal = createWalletModal();
          modal.style.display = 'flex';
        }, true);
      });
    }
  }
  
  // Create the wallet modal on page load
  createWalletModal();
  
  // Initial check
  addWalletDisconnect();
  
  // Check periodically for new wallet info elements (in case they're added dynamically)
  setInterval(addWalletDisconnect, 2000);
});
