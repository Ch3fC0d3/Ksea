import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Use the PORT environment variable provided by the hosting platform, or default to 3000
const PORT = process.env.PORT || 3000;

// Path to the built React app
const buildPath = path.join(__dirname, 'my-nft-project', 'nft-frontend', 'build');

// Serve static files from the React build directory
app.use('/Ksea', express.static(buildPath));

// For any other routes, redirect to the React app
app.get('/*', (req, res) => {
  if (req.path.startsWith('/Ksea')) {
    res.sendFile(path.join(buildPath, 'index.html'));
  } else {
    res.redirect('/Ksea');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access the site at http://localhost:${PORT}/Ksea`);
});
