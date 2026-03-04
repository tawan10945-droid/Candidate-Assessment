// app.js
const express = require('express');
const app = express();

const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const todoRoutes = require('./routes/todo');

// 1. Built-in middleware to parse JSON request bodies
app.use(express.json());

// 2. Serve static files from 'public' directory (our frontend)
app.use(express.static('public'));

// 3. API Routes - protected with auth middleware

app.use('/todos', authMiddleware, todoRoutes);

// 4. Catch-all for 404 Route Not Found
app.use((req, res, next) => {
    res.status(404).json({ error: 'API endpoint not found' });
});

// 5. Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
