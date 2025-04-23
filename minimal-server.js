// Minimal static file server for Digital Ocean
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

// Log startup information
console.log('Starting minimal server...');
console.log(`Port: ${PORT}`);
console.log(`Current directory: ${process.cwd()}`);

// Serve static files from the current directory
app.use(express.static(__dirname));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
