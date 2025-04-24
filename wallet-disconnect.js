// Simple wallet disconnect script for KSEA NFT project
document.addEventListener('DOMContentLoaded', function() {
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
          
          // Reload the page to reset the app state
          window.location.reload();
          
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
          notification.style.zIndex = '10000';
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
  }
  
  // Initial check
  addWalletDisconnect();
  
  // Check periodically for new wallet info elements (in case they're added dynamically)
  setInterval(addWalletDisconnect, 2000);
});
