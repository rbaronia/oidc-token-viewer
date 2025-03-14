// Simple Express server to serve the static files for the OIDC Token Viewer
const express = require('express');
const path = require('path');
const app = express();

// Enable gzip compression
const compression = require('compression');
app.use(compression());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something broke!');
});

// Serve static files from the 'build' directory with caching
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1h',
  etag: true,
  lastModified: true
}));

// For any request that doesn't match a static file, serve index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'build', 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send('Error loading application');
    }
  });
});

// Get port from environment variable (for Glitch compatibility) or use 3000 as default
const PORT = process.env.PORT || 3000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't crash the server
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  // Don't crash the server
});

// Handle memory warnings
process.on('warning', (warning) => {
  if (warning.name === 'HeapSizeExceededWarning') {
    console.warn('Memory warning:', warning.message);
    global.gc && global.gc(); // Run garbage collection if available
  }
});

// Clean up on exit
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Performing cleanup...');
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open your browser to http://localhost:${PORT} or your Glitch URL`);
});
