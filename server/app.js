const express = require('express');
const path = require('path');
const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (including favicon)
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use('/api', require('./routes/api'));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;