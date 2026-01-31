const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up views if needed (using static for this project as per constraints)
// app.set('view engine', 'ejs');

// Routes
const authRoutes = require('./routes/authRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler for undefined API routes
app.use('/api', (req, res, next) => {
    const error = new Error(`Can't find ${req.originalUrl} on this server!`);
    error.status = 'fail';
    error.statusCode = 404;
    next(error);
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;
