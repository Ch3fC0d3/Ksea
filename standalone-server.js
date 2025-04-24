// Standalone server with NO dependencies
// This server uses ONLY Node.js built-in modules
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
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

// Log function
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Error log function
function errorLog(message, error) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ERROR: ${message}`, error || '');
}

// Create HTTP server
const server = http.createServer((req, res) => {
  log(`${req.method} ${req.url}`);
  
  // Handle health check endpoint (required by Digital Ocean)
  if (req.url === '/health') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('OK');
    return;
  }
  
  // Normalize URL path
  let urlPath = req.url;
  
  // Handle /Ksea/ path prefix
  if (urlPath.startsWith('/Ksea/')) {
    urlPath = urlPath.substring(5); // Remove /Ksea/ prefix
  }
  
  // Default to index.html for root path
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/index.html';
  }
  
  let filePath = path.join(process.cwd(), urlPath);
  
  // Security check - prevent directory traversal
  if (!filePath.startsWith(process.cwd())) {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('403 Forbidden');
    return;
  }
  
  // Check if path exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // File not found - try index.html
      const indexPath = path.join(process.cwd(), 'index.html');
      fs.stat(indexPath, (err2, stats2) => {
        if (err2) {
          // Can't even serve index.html
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end('404 Not Found');
        } else {
          // Serve index.html instead
          serveFile(indexPath, 'text/html', res);
        }
      });
      return;
    }
    
    // Handle directory
    if (stats.isDirectory()) {
      const indexPath = path.join(filePath, 'index.html');
      fs.stat(indexPath, (err2, stats2) => {
        if (err2) {
          // No index.html in directory - serve main index.html
          const mainIndexPath = path.join(process.cwd(), 'index.html');
          fs.stat(mainIndexPath, (err3, stats3) => {
            if (err3) {
              res.statusCode = 404;
              res.setHeader('Content-Type', 'text/plain');
              res.end('404 Not Found');
            } else {
              serveFile(mainIndexPath, 'text/html', res);
            }
          });
        } else {
          // Serve directory's index.html
          serveFile(indexPath, 'text/html', res);
        }
      });
      return;
    }
    
    // Get file extension and content type
    const extname = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // Serve the file
    serveFile(filePath, contentType, res);
  });
});

// Function to serve a file
function serveFile(filePath, contentType, res) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      errorLog(`Error reading file ${filePath}:`, err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain');
      res.end('500 Internal Server Error');
      return;
    }
    
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(content);
  });
}

// Start server
server.listen(PORT, '0.0.0.0', () => {
  log(`Server running at http://0.0.0.0:${PORT}`);
  log(`Current directory: ${process.cwd()}`);
  log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // List files in current directory
  try {
    const files = fs.readdirSync(process.cwd());
    log(`Files in current directory: ${files.join(', ')}`);
  } catch (error) {
    errorLog('Error listing directory:', error);
  }
});

// Handle server errors
server.on('error', (error) => {
  errorLog('Server error:', error);
});

// Handle process termination
process.on('SIGTERM', () => {
  log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    log('Server closed');
    process.exit(0);
  });
  
  // Force close after 10s
  setTimeout(() => {
    errorLog('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  errorLog('Uncaught exception:', error);
  // Continue running - don't exit
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  errorLog('Unhandled promise rejection:', reason);
  // Continue running - don't exit
});
