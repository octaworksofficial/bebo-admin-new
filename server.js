const express = require('express');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

console.log('Starting server...');
console.log('PORT env:', process.env.PORT);
console.log('Current directory:', __dirname);

const app = express();
const PORT = process.env.PORT || 8080;

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
console.log('Dist path:', distPath);
console.log('Dist exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  console.log('Dist contents:', fs.readdirSync(distPath).slice(0, 10));
}

// Gzip compression
app.use(compression());

// Health check endpoint - MUST be first
app.get('/health', (req, res) => {
  console.log('Health check hit');
  res.status(200).send('OK');
});

// Root health check for Railway
app.get('/', (req, res, next) => {
  if (req.headers['user-agent'] && req.headers['user-agent'].includes('curl')) {
    return res.status(200).send('OK');
  }
  next();
});

// Serve static files from dist folder
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: false
}));

// Handle Angular routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Server error');
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
