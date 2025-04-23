// Ultra-basic static file server for Digital Ocean
const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const PORT = process.env.PORT || 8080;

// MIME types for common file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Create HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // Handle health check endpoint (required by Digital Ocean)
  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('OK');
    return;
  }
  
  // Normalize URL path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Get file extension
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - try index.html
        fs.readFile('./index.html', (err, content) => {
          if (err) {
            // Can't even serve index.html
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('404 Not Found');
          } else {
            // Serve index.html instead
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('500 Internal Server Error\n' + error.code);
      }
    } else {
      // Success - serve the file
      res.statusCode = 200;
      res.setHeader('Content-Type', contentType);
      res.end(content, 'utf-8');
    }
  });
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`Current directory: ${process.cwd()}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  // List files in current directory
  try {
    const files = fs.readdirSync('.');
    console.log('Files in current directory:', files);
  } catch (error) {
    console.error('Error listing directory:', error);
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});
