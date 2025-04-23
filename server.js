// Simple Express server for Digital Ocean App Platform
const express = require('express');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();

// Use PORT provided by Digital Ocean
const PORT = process.env.PORT || 8080;

// Log startup information
console.log('Starting server...');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`Port: ${PORT}`);
console.log(`Current directory: ${process.cwd()}`);

// List directory contents for debugging
const dirContents = fs.readdirSync('.');
console.log('Directory contents:', dirContents);

// Determine build path
let buildPath;
if (fs.existsSync(path.join(__dirname, 'my-nft-project', 'nft-frontend', 'build'))) {
  buildPath = path.join(__dirname, 'my-nft-project', 'nft-frontend', 'build');
  console.log(`Using build path: ${buildPath}`);
} else if (fs.existsSync(path.join(__dirname, 'build'))) {
  buildPath = path.join(__dirname, 'build');
  console.log(`Using alternate build path: ${buildPath}`);
} else {
  console.log('No build directory found. Listing available directories:');
  const findBuildDirs = (dir, depth = 0) => {
    if (depth > 2) return; // Limit recursion depth
    
    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);
        if (stats.isDirectory()) {
          console.log(`Directory: ${itemPath}`);
          if (item === 'build') {
            console.log(`Found potential build directory: ${itemPath}`);
            buildPath = itemPath;
          }
          findBuildDirs(itemPath, depth + 1);
        }
      });
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err.message);
    }
  };
  
  findBuildDirs(__dirname);
  
  if (!buildPath) {
    buildPath = __dirname; // Fallback to current directory
    console.log(`Fallback to current directory: ${buildPath}`);
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files
app.use('/Ksea', express.static(buildPath));

// Handle all routes
app.get('/*', (req, res) => {
  try {
    if (req.path.startsWith('/Ksea')) {
      const indexPath = path.join(buildPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`index.html not found at ${indexPath}`);
        res.status(404).send(`index.html not found at ${indexPath}`);
      }
    } else {
      res.redirect('/Ksea');
    }
  } catch (error) {
    console.error('Request error:', error.message);
    res.status(500).send('Server error: ' + error.message);
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error.message);
  process.exit(1);
});

// Keep the process alive
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error.message);
  console.error(error.stack);
});

