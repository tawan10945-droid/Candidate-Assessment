/**
 * Central Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('[Error Handler]:', err);

    // Default to 500 Internal Server Error if status is not set
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        error: message,
        // Provide stack trace only in development environment
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

module.exports = errorHandler;
