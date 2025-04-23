import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set NODE_ENV to production if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}

// Initialize Express app
const app = express();

// Use the PORT environment variable provided by the hosting platform, or default to 8080
const PORT = process.env.PORT || 8080;

console.log(`Starting server with NODE_ENV=${process.env.NODE_ENV} on PORT=${PORT}`);


// Path to the built React app
const buildPath = path.join(__dirname, 'my-nft-project', 'nft-frontend', 'build');

// Check if build directory exists
if (!fs.existsSync(buildPath)) {
  console.warn(`Warning: Build directory not found at ${buildPath}`);
  console.log('Available directories:');
  fs.readdirSync(__dirname).forEach(file => {
    console.log(` - ${file} ${fs.statSync(path.join(__dirname, file)).isDirectory() ? '(directory)' : '(file)'}`);
  });
  
  // Check if there's a build directory directly in the root
  if (fs.existsSync(path.join(__dirname, 'build'))) {
    console.log('Found build directory in root, using that instead');
    buildPath = path.join(__dirname, 'build');
  }
}

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Serve static files from the React build directory
app.use('/Ksea', express.static(buildPath));

// For any other routes, redirect to the React app
app.get('/*', (req, res) => {
  try {
    if (req.path.startsWith('/Ksea')) {
      const indexPath = path.join(buildPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        console.error(`Error: index.html not found at ${indexPath}`);
        res.status(404).send('index.html not found');
      }
    } else {
      res.redirect('/Ksea');
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).send('Internal server error');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Something broke!');
});

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the site at http://localhost:${PORT}/Ksea`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use`);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  server.close(() => {
    process.exit(1);
  });
});
