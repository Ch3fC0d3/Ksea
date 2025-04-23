import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Serve static files from the root directory
app.use('/Ksea', express.static(__dirname));

// Redirect root to /Ksea
app.get('/', (req, res) => {
  res.redirect('/Ksea');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/Ksea`);
  console.log(`Access the site at http://localhost:${PORT}`);
});
